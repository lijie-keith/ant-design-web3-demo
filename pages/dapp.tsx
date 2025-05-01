import {
    // Address,
    ConnectButton,
    Connector,
    // NFTCard,
    useAccount,
    useProvider
  } from "@ant-design/web3";
  import {
    Sepolia,
    MetaMask,
    WagmiWeb3ConfigProvider,
    Polygon
  } from "@ant-design/web3-wagmi";
  import { Button, message } from "antd";
  import { parseEther } from "viem";
  import { createConfig, http, useReadContract, useWriteContract } from "wagmi";
  import { sepolia, mainnet, polygon } from "wagmi/chains";
  import { injected } from "wagmi/connectors";
  
  const config = createConfig({
    chains: [mainnet, sepolia,polygon],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
    },
    connectors: [
      injected({
        target: "metaMask",
      }),
    ],
  });

  const contractInfo = [
    {
      id:1,
      name: "Ethereum",
      contractAddress: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
    },
    {
      id:5,
      name: "Sepolia",
      contractAddress: "0xb091A6d454DD4c160960277A5e6746029c974bfD"
    },
    {
      id:137,
      name: "Polygon",
      contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c"
    }
  ]
  
  const CallTest = () => {
    const { account } = useAccount();
    const { chain } = useProvider();
    const result = useReadContract({
      abi: [
        {
          type: "function",
          name: "balanceOf",
          stateMutability: "view",
          inputs: [{ name: "account", type: "address" }],
          outputs: [{ type: "uint256" }],
        },
      ],
      // Sepolia test contract 0x418325c3979b7f8a17678ec2463a74355bdbe72c
      // address: "0xb091A6d454DD4c160960277A5e6746029c974bfD",
      address: contractInfo.find((item) => item.id === chain?.id)?.contractAddress as `0x${string}`,
      functionName: "balanceOf",
      args: [account?.address as `0x${string}`],
    });
    const { writeContract } = useWriteContract();
  
    return (
      <div>
        {result.data?.toString()}
        <Button
          onClick={() => {
            writeContract(
              {
                abi: [
                  {
                    type: "function",
                    name: "mint",
                    stateMutability: "payable",
                    inputs: [
                      {
                        internalType: "uint256",
                        name: "quantity",
                        type: "uint256",
                      },
                    ],
                    outputs: [],
                  },
                ],
                // address: "0xb091A6d454DD4c160960277A5e6746029c974bfD",
                address: contractInfo.find((item) => item.id === chain?.id)?.contractAddress as `0x${string}`,
                functionName: "mint",
                args: [BigInt(1)],
                value: parseEther("0.01"),
              },
              {
                onSuccess: () => {
                  message.success("Mint Success");
                },
                onError: (err) => {
                  message.error(err.message);
                },
              }
            );
          }}
        >
          mint
        </Button>
      </div>
    );
  };
  
  export default function Web3() {
    return (
      <WagmiWeb3ConfigProvider
        config={config}
        chains={[Sepolia,Polygon]}
        wallets={[MetaMask()]}
        eip6963={{
            autoAddInjectedWallets: true
        }}
      >
        {/* <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
        <NFTCard
          address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
          tokenId={641}
        /> */}
        <Connector>
          <ConnectButton />
        </Connector>
        <CallTest />
      </WagmiWeb3ConfigProvider>
    );
  }