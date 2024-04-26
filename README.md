# 2024 Sui Hacker House - Build on Sui

새로운 체인을 공부할 때 가장 빠르고 잘 이해할 수 있는 좋은 방법은 해커톤을 참여해서 즐기는 것이라고 생각합니다.

그리고 새로운 체인, 개발 언어를 공부할 때 가장 도움이 되는 것이 개발 환경을 구축하는 것이라고 생각합니다.

이 문서는 15분 세션을 위한 공식 docs를 아주 압축한 개발환경 구축에 대한 내용입니다.


## 사전 지식
Sui의 아주 기본적인 개념
  - 수이는 빠르다
  - 수이의 모든 것은 Object이다.

## 개발 환경 구축
개발 환경은 2가지 컨트랙트 개발과 프론트 개발 파트로 구분

#### 준비
- nodejs 설치
- suiwallet chrome extension 설치, 설정 - network - testnet
- yarn 설치

### 컨트랙트 개발

sui client 설치 및 환경 구성

```bash
#sui client 설치
brew install sui

#sui client 실행시 지갑 생성(key scheme 등 설정, 나오는 니모닉을 sui wallet chrome extension에 넣는다)
sui client

#sui address 확인
sui client addresses

#testnet 환경 추가
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

#환경 변경 및 확인
sui client switch --env testnet
sui client envs

#faucet 및 balance 조회
sui client faucet
sui client balance

#sui config 파일들 확인
ls ~/.sui/sui_config
```

프로젝트 생성

```bash
#신규 프로젝트 생성
sui move new examples

#https://examples.sui.io/samples/coin.html 코드를 mycoin.move로 생성
cd examples

#테스트 및 빌드
sui move test
sui move build

#배포
sui client publish --json --gas-budget 1000000000 .
```
  
### 프론트 개발 https://sdk.mystenlabs.com/dapp-kit

프로젝트 생성 및 실행
```bash
#프로젝트 생성 (react-client-dapp, front로 추가 커맨드 입력)
npm create @mysten/dapp
cd front

#실행
yarn
yarn dev
```

지갑 연결
```javascript
import { ConnectButton } from "@mysten/dapp-kit";

...
<ConnectButton />
...
```

계정 정보 및 데이터 조회
```javascript
//계정 정보
//https://suiscan.xyz/testnet/account/{account}
const account = useCurrentAccount();

//소유한 object 목록 확인
const { data, isPending, error } = useSuiClientQuery(
  "getOwnedObjects",
  {
    owner: account?.address as string,
  },
  {
    enabled: !!account,
  },
);
```

서명 및 전송
```javascript
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

```

### 참고 하면 좋을 문서들
- contract 예제들
   - https://examples.sui.io

- 학회 전용 nft 컨트랙트
   - https://github.com/Eis-D-Z/university_club
- 수이 워크샵 세션
   - https://www.youtube.com/watch?v=yNA6aeNtJR4
   - https://github.com/Eis-D-Z/trading_cards

- 수이 워크샵 세션
   - https://https//www.youtube.com/watch?v=tAi9xromPhs
   - https://docs.sui.io/guides/developer/app-examples/trustless-swap/