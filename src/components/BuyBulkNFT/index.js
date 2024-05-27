import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import s9yNft from '../../assets/s9ynft.jpeg';
import { useSearchParams } from 'react-router-dom';

export default function BuyBulkNFT() {

  const [searchParams] = useSearchParams();

  const getKey = () => {
    let key;
    if (searchParams.get('key')) {
      key = searchParams.get('key');
    } else if (localStorage.getItem('singularity-key')) {
      key = localStorage.getItem('singularity-key');
    } else {
      key = 2; // default key
    }
    localStorage.setItem('singularity-key', key);
    return key;
  }

  const nftTypes = [
    {
      value: 'ERC1155',
      label: 'ERC1155',
    },
  ];

  const tradeType = [
    {
      value: 'BUY',
      label: 'BUY',
    }
  ];

  const getClientRequestedAssetId = () => {
    return getKey() === '40875' ? '408750' : '800010'
  }

  const getMarketplaceId = () => {
    return getKey() === '40875' ? 'MARKETPLACE_2' : 'MARKETPLACE_1'
  }

  const getNftId = () => {
    return getKey() === '40875' ? '0' : '0'
  }

  const getNftAddress = () => {
    return getKey() === '40875' ? '0x32AA1A10383C0499FaA7ed09Bc52424A99985E35' : '0x572954A0db4bdA484CebbD6e50dBA519d35230Bc'
  }

  const getNftType = () => {
    return getKey() === '40875' ? 'ERC1155' : 'ERC1155'
  }

  const getTradeType = () => {
    return getKey() === '40875' ? 'BUY' : 'BUY'
  }

  const getNftPrice = () => {
    return getKey() === '40875' ? '0.1' : '0.001'
  }

  const getTokenName = () => {
    return getKey() === '40875' || '19011' ? 'OAS' : 'MATIC'
  }


  const [clientRequestedAssetTd, setClientRequestedAssetTd] = useState(getClientRequestedAssetId());
  const [marketPlaceId, setMarketPlaceId] = useState(getMarketplaceId());
  const [userRequestedNftId, setUserRequestedNftId] = useState(getNftId());
  const [userRequestedNftAddress, setUserRequestedNftAddress] = useState(getNftAddress());
  const [userRequestedNftQuantity, setUserRequestedNftQuantity] = useState('');
  const [userRequestedNftType, setUserRequestedNftType] = useState(getNftType);
  const [userRequestedNFTTradeType, setUserRequestedNFTTradeType] = useState(getTradeType);
  const [userRequestedNftPrice, setUserRequestedNftPrice] = useState(getNftPrice());
  const [loading, setLoading] = useState(false);

  const [deadline, setDeadline] = useState('');
  const [paravoxSignature, setParavoxSignature] = useState('');

  const initiateTransaction = async () => {
    setLoading(true);

    try {
      const clientReferenceId = uuidv4();

      let paravoxMarketplaceData = {
        timestamp : deadline,
        signature : paravoxSignature
      }

    try {
            const raw = JSON.stringify({
              "tokenIDs": [
                1
              ],
              "amounts": [
                1
              ],
              "paymentTokenAddress": "0x0000000000000000000000000000000000000000",
              "unitPrices": [
                0.41086
              ]
            });
            const resp = await fetch("https://mtockvm4c1.execute-api.ap-northeast-1.amazonaws.com/marketplace/marketplaceVerify", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: raw,
            })

            const respData = await resp.json();
            console.log('respData', respData);
            paravoxMarketplaceData = JSON.parse(respData.body);
    } catch (error) {
      console.log(error);
    }



      let body = {
        clientReferenceId,
        singularityTransactionType: 'NFT_PURCHASE',
        transactionIconLink: 'https://singularity-web-assets-public.s3.ap-south-1.amazonaws.com/s9ynft.jpeg',
        transactionLabel: 'S9Y NFT',
        clientReceiveObject: {
          clientRequestedAssetId: 190110,
          address: "0xCA4511435F99dcbf3Ab7cba04C8A16721eB7b894"
        },
        userReceiveAssetDetailsList: [
          {
            marketplaceId: "PARAVOX_PRIMARY_MARKETPLACE_19011",
            userRequestedNFTId: 1,
            userRequestedNFTAddress: "0x04B9762d2777c2aA394a67e0772598DF88738fBa",
            userRequestedNFTQuantity: 1,
            userRequestedNFTType: "ERC1155",
            userRequestedNFTPrice: 0.41086,
            userRequestedNFTTradeType: "BUY",
            marketplaceData : JSON.stringify({
                   deadline: paravoxMarketplaceData.timestamp,
                   paravoxSignature: paravoxMarketplaceData.signature
            })
          }
        ]
      };

      console.log('Body to generate signature ---->', body);
      const requestString = JSON.stringify(body);
      window.SingularityEvent.transactionFlow(requestString);
    } catch (err) {
      window.alert('Some error occured');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        border: '6px solid white',
        bgcolor: '#FFFFFFA6',
        width: ['100%', 410],
        boxSizing: 'border-box',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography textAlign="center" mb={1}>
        Buy Bulk NFT (This is configured For Paravox Marketplace)
      </Typography>

      <Box textAlign="center" my={1}>
        <img src={s9yNft} alt="" height="100px" />
      </Box>

{/*
      <TextField
        placeholder="Quantity"
        label="Quantity"
        type={'number'}
        value={userRequestedNftQuantity}
        onChange={e => setUserRequestedNftQuantity(e.target.value)}
        inputProps={{ style: { fontSize: '20px', height: '100%' } }}
        sx={{ mt: 1 }}
      /> */}

      <TextField
        placeholder="signature"
        label="Signature"
        type={'text'}
        value={paravoxSignature}
        onChange={e => setParavoxSignature(e.target.value)}
        inputProps={{ style: { fontSize: '20px', height: '100%' } }}
        sx={{ mt: 1 }}
      />

      <TextField
        placeholder="Signature Deadline"
        label="Deadline"
        type={'text'}
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        inputProps={{ style: { fontSize: '20px', height: '100%' } }}
        sx={{ mt: 1 }}
      />

      <div>
        1 NFT = {getNftPrice()} {getTokenName()}
        <br />
        Price = {Number(userRequestedNftPrice) * (Number(userRequestedNftQuantity))} {getTokenName()}
      </div>

      <Button
        sx={{
          fontSize: 20,
          lineHeight: '23px',
          mt: 1,
        }}
        variant="contained"
        disabled={!userRequestedNftType || loading}
        onClick={initiateTransaction}
      >
        {loading ? 'Loading' : 'Buy'}
      </Button>
    </Box>
  );
}
