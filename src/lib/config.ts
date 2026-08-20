import image1 from "@/app/assets/btc.png";
import image2 from "@/app/assets/tether.png";
import image3 from "@/app/assets/etherium.png";
import image4 from "@/app/assets/xrp.png";
import image5 from "@/app/assets/solana.jpg";
import genericIcon from "@/app/assets/binance.png";

export const WALLETS = [
  {
    name: 'Bitcoin',
    symbol: image1,
    address: process.env.NEXT_PUBLIC_BTC_ADDRESS || 'bc1qscrfp2jvc9t77npvg5zj636hyhugtf5zpjtcun',
  },
  {
    name: 'Ethereum',
    symbol: image3,
    address: process.env.NEXT_PUBLIC_ETH_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Tether (ERC20)',
    symbol: image2,
    address: process.env.NEXT_PUBLIC_USDT_ERC20_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'USDC (ERC20)',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_USDC_ERC20_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Tether (BEP20)',
    symbol: image2,
    address: process.env.NEXT_PUBLIC_USDT_BEP20_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Ripple',
    symbol: image4,
    address: process.env.NEXT_PUBLIC_XRP_ADDRESS || 'rag4voiXTrLszwWVQDngtABMMBZTgBzWsM',
  },
  {
    name: 'Solana',
    symbol: image5,
    address: process.env.NEXT_PUBLIC_SOL_ADDRESS || '8Zu3nmBSBF4sTzUdRKSRCmDuDsxM7bjR8RFCVsDxiRtp',
  },
  {
    name: 'BNB Smart Chain',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_BNB_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Tron',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_TRX_ADDRESS || 'TEwhYX9jkX2iRXDA5PZYBWpP4MGXrgM3gQ',
  },
  {
    name: 'Arbitrum',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ARB_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Aeternity',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_AE_ADDRESS || 'ak_26ycmHPXNRstc7hPceh3yqARr2nCCEZHkvc6fvNY4y8C9bGJW4',
  },
  {
    name: 'Aptos',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_APT_ADDRESS || '0xa08d0483cc724b1553a913f87f552533b549b422326b48b75186a2591cb3a59b',
  },
  {
    name: 'Akash',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_AKT_ADDRESS || 'akash14jncs8n95qt0adl2qs2vl9f9jv9g4q5wtv53j2',
  },
  {
    name: 'Algorand',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ALGO_ADDRESS || 'TVSGANJRLGS2ERUA7DUEL2LOUGNBLQ6VDFTVL2CJ5GVGJAWT4NOWSRXPXI',
  },
  {
    name: 'Sui',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_SUI_ADDRESS || '0x010d349ca26779861f9f79fb4e7a2eb6efdb2b5e4794ca749bc0eb5607eb9561',
  },
  {
    name: 'Aurora',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_AURORA_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Avalanche C-Chain',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_AVAX_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Axelar',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_AXL_ADDRESS || 'axelar14jncs8n95qt0adl2qs2vl9f9jv9g4q5wze07q3',
  },
  {
    name: 'Bitcoin Cash',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_BCH_ADDRESS || 'qrxs76ljv7ja23p76cgljxlhgn6lstf0gu925keex3',
  },
  {
    name: 'Blast',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_BLAST_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Boba',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_BOBA_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'BounceBit',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_BB_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Cardano',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ADA_ADDRESS || 'addr1q83pzzp26x2qfma39zmk4h2alz74w4208mqskk85q0vkulmlnpdngtwxuw9yfaj9ntry8jjn9j4n99294jr0tys3jl9svx7q85',
  },
  {
    name: 'Celo',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_CELO_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Conflux eSpace',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_CFX_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Cosmos Hub',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ATOM_ADDRESS || 'cosmos14jncs8n95qt0adl2qs2vl9f9jv9g4q5wxhekts',
  },
  {
    name: 'Cronos Chain',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_CRO_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Crypto.org',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_CRO_ORG_ADDRESS || 'cro1kygd6nwmypt7pmlvxyps0egwyhuydzah6rhyem',
  },
  {
    name: 'Dash',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_DASH_ADDRESS || 'XbrAVFz2n4vrMSiHDrq12smbjUKz4KzrpU',
  },
  {
    name: 'Decred',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_DCR_ADDRESS || 'DsUb5L5Wip7qJ9GYiAaVAjRBNLGzsj7npWN',
  },
  {
    name: 'DigiByte',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_DGB_ADDRESS || 'dgb1qy5z3lckggjqn0ce0spcvujc6rxkjyh22rqevqj',
  },
  {
    name: 'Dogecoin',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_DOGE_ADDRESS || 'DGNxGzuKBDKHif3DGJdMuv46h3hzas25zy',
  },
  {
    name: 'Evmos',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_EVMOS_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'FIO Protocol',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_FIO_ADDRESS || 'FIO817LhucEFQU1B3FcTrRmFaUF75EmdSUsURj871pT4A1jsij9W7',
  },
  {
    name: 'Ethereum Classic',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ETC_ADDRESS || '0xDcf366B60158cc808aAA3C3971acFa22C0C3603D',
  },
  {
    name: 'Fantom',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_FTM_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Filecoin',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_FIL_ADDRESS || 'f1cdgex2csotpclb7vyppusb2pcbg6oh6migt2ewa',
  },
  {
    name: 'Firo',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_FIRO_ADDRESS || 'a9HFyohPzWqp3qCnHc34dwr3G7pDHJMWHY',
  },
  {
    name: 'Zcash',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ZEC_ADDRESS || 't1JxxbLdxxEB5RM2BaNW5HWRhGQ3taN85Xi',
  },
  {
    name: 'Flux',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_FLUX_ADDRESS || '0xCB7a2C03ea5F45A29688E83e787B7528721E0df9',
  },
  {
    name: 'Groestlcoin',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_GRS_ADDRESS || 'grs1qaye6aywf93unr04haf4kruq20rn509lezvk5c8',
  },
  {
    name: 'Harmony',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ONE_ADDRESS || 'one13r9y6vql80qls897rj7q9syk2y8wrzg8fa7g8w',
  },
  {
    name: 'ICON',
    symbol: genericIcon,
    address: process.env.NEXT_PUBLIC_ICX_ADDRESS || 'hxf1acc08bcfd95d28eb5b8aaf3db3d22e4a98b600',
  },
];
