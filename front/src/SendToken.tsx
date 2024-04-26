import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button, Flex } from "@radix-ui/themes";
import { useState } from "react";

export function SendToken() {
  const account = useCurrentAccount();
	const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
	const [digest, setDigest] = useState('');

  if (!account) {
    return;
  }

  return (
    <Flex direction="column" my="2">
    {account && (
      <>
        <div>
          <Button
            onClick={() => {
              signAndExecuteTransactionBlock(
                {
                  transactionBlock: new TransactionBlock(),
                  chain: 'sui:testnet',
                },
                {
                  onSuccess: (result) => {
                    console.log('signed transaction block', result);
                    setDigest(result.digest);
                  },
                },
              );
            }}
          >
            Send
          </Button>
        </div>
        <div>Signature: {digest}</div>
      </>
    )}
    </Flex>
  );
}
