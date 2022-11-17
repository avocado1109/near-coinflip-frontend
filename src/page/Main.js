import React, { useState, useEffect } from 'react';

import './coin.css';
import './Main.scss';

// menu bar
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { Grid } from '@mui/material';
import { styled } from '@mui/material';

//slider
import Slider, { SliderThumb } from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
// modal
import Modal from '@mui/material/Modal';
// modal amount input
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// icons
// import { BsTwitter } from "@react-icons/all-files/bi/BiTwitter";
import FundModal from '../components/FundModal';

// near web3
// import * as nearAPI from 'near-api-js'
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

// const { connect } = nearAPI;

const nearConfig = {
    networkId: "testnet",
    keyStore,
    contractName: 'dev-1651643292484-50465048732714',
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

// frontend styles section
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #350994',
    boxShadow: 24,
    p: 4,
    borderRadius: '15px'
};

function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
};


const PrettoSlider = styled(Slider)({
    color: '#F4900C',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#F4900C',
        border: '2px solid #E3900C',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#F4900C',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

const Item = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    // ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: 'transparent',
    boxShadow: 'none'
}));

const Main = () => {
    const [nader, setNader] = useState('nader');
    const [result, setResult] = useState('');
    const [playVal, setPlayVal] = useState(0)
    const [side, setSide] = useState('heads')
    const [fundType, setFundType] = useState('')

    const [open, setOpen] = React.useState(false);
    const handleOpen = (type) => {
        setOpen(true)
        setFundType(type)
    }
    const handleClose = () => setOpen(false);

    const coinToss = () => {
        if (Math.random() < 0.5) {
            setResult('heads')
            console.log("heads");
        } else {
            setResult('tails');
            console.log("tails");
        }
    }

    const onClickSide = (type) => {
        setSide(type)
        setResult(type)
    }

    const handleSliderChange = (event, newValue) => {
        setPlayVal(newValue);
    };

    const setSpecialVal = (newValue) => {
        setPlayVal(newValue)
    }

    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    // web3 section 
    const [near, setNear] = useState()
    const [accountId, setAccountId] = useState()
    const [contract, setContract] = useState()
    const [wallet, setWallet] = useState()
    const [connectBtnCaption, setConnectionBtnCaption] = useState('Connect Wallet')
    const initContract = async () => {
        // Initialize connection to the NEAR testnet
        const nearTemp = await connect(nearConfig)
        setNear(nearTemp)
        console.log('near: ', nearTemp)
        const walletTemp = new WalletConnection(nearTemp)
        setWallet(walletTemp)
        console.log('wallet: ', walletTemp)

        const accountIdTemp = walletTemp.getAccountId()
        setAccountId(accountIdTemp)
        console.log('accountId: ', accountIdTemp)

        if (!accountIdTemp) {
            return
        }
        // if (wallet.isSignedIn()) {
        //     console.log("You are signed")
        // }
        // // wallet.requestSignIn(contractName)
        // if (wallet.isSignedIn()) {
        //     console.log("You are signed")
        // }

        const account = await nearTemp.account(accountIdTemp);
        console.log('account: ', account)
        const myBalance = await account.getAccountBalance();
        console.log('my balance: ', myBalance)


        // const contract = await new Contract(wallet.account(), nearConfig.contractName)

        // Initializing Wallet based Account. It can work with NEAR testnet wallet that
        // is hosted at https://wallet.testnet.near.org
        // window.walletConnection = new WalletConnection(near)

        // // Getting the Account ID. If still unauthorized, it's just empty string
        // window.accountId = window.walletConnection.getAccountId()

        // // Initializing our contract APIs by contract name and configuration
        // window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
        //     // View methods are read only. They don't modify the state, but usually return some value.
        //     viewMethods: ["event_count"],
        //     // Change methods can modify the state. But you don't receive the returned value when called.
        //     changeMethods: ['add_event', 'add_vote', "list_events"],
        // })
    }

    const onConnectClick = async () => {
        if (wallet.isSignedIn()) {
            console.log("You are already signed")

        } else {
            wallet.requestSignIn(nearConfig.contractName)
        }
        if (wallet.isSignedIn()) {
            console.log('you are signed')

            setConnectionBtnCaption(accountId)

            const contractTemp = await new Contract(wallet.account(), nearConfig.contractName, {
                viewMethods: ['get_creator', 'get_user_balance', 'get_history', 'get_times', 'get_current_timestamp'],
                changeMethods: ['flip', 'deposit', 'withdraw', 'user_deposit', 'user_withdraw']
            })
            setContract(contractTemp)
            console.log('contract: ', contractTemp)
            return
        }

        // if (wallet.isSignedIn()) {
        //     console.log("You are signed now!")
        //     setConnectionBtnCaption(accountId)

        //     const contractTemp = await new Contract(wallet.account(), nearConfig.contractName, {
        //         viewMethods: ['get_creator', 'get_user_balance'],
        //         changeMethods: ['']
        //     })
        //     setContract(contractTemp)
        //     console.log('contract: ', contractTemp)
        // }
    }

    useEffect(async () => {
        await initContract()
    }, [connectBtnCaption])

    useEffect(async () => {
        if (contract) {
            const accountIdTemp = await contract.get_creator()
            console.log('contract account Id: ', accountIdTemp)
        }
    }, [contract])
    return (
        <div className='body'>
            <AppBar position="static" sx={{ backgroundColor: '#1C1F25' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <img src='/assets/logo.png' alt='flip'
                            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                        />
                        <div className='menuItem'>COINFLIP</div>
                        <div className='menuItem'>COINFLIP (PVP)</div>
                        <div className='menuItem'>FAQ</div>
                        <div className='menuItem'>LEADERBOARD</div>
                    </Typography>
                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>COINFLIP</Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>COINFLIP</Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>COINFLIP</Typography> */}

                    <Button onClick={onConnectClick} color='secondary' variant="outlined" sx={{ color: 'white' }}>{connectBtnCaption}</Button>
                </Toolbar>
            </AppBar>
            <div className='container'>
                <Box
                    sx={{ flexGrow: 1, mt: 5, pb: 5, pt: 5 }}
                >
                    <Grid
                        container rowSpacing={3} direction='row' justifyContent='space-between'
                        sx={{ flexWrap: 'wrap-reverse', }}
                    >
                        <Grid item xs={12} sm={4}
                            sx={{
                                backgroundColor: '#1C1F25',
                                borderRadius: '15px',
                                p: 3
                            }}
                        >
                            <Item
                                sx={{ color: 'wheat', fontSize: '35px', fontWeight: 'bold' }}
                            >
                                Recent Flips
                            </Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'wheat' }}>
                                <h4 style={{ color: 'wheat' }}>dleer.near flipped TAILS betting 0.400 Ⓝ and lost</h4>
                                <h4 style={{ marginLeft: '20px', color: 'yellow' }}>152h 22m</h4>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'wheat' }}>
                                <h4 style={{ color: 'wheat' }}>dleer.near flipped TAILS betting 0.400 Ⓝ and lost</h4>
                                <h4 style={{ marginLeft: '20px', color: 'yellow' }}>152h 23m</h4>
                            </div>

                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={7}
                            sx={{
                                // backgroundColor: 'rgba(255,255,100, 0.2)',
                                // backgroundImage: 'linear-gradient(180deg, #b4ded8, rgba(255,255,100, 0.2))',
                                borderRadius: '15px',
                                p: 3
                            }}
                        >
                            <div style={{ width: '100%', marginLeft: '0%' }}>
                                <Item
                                // sx={{ backgroundImage: 'linear-gradient(180deg, #b4ded8, #0b473f)' }}
                                >
                                    {/* <div id="coin" className={result} >
                                        <div className="side-a">
                                            <h2>TAIL</h2>
                                        </div>
                                        <div className="side-b">
                                            <h2>HEAD</h2>
                                        </div>
                                    </div> */}
                                    {
                                        side === 'heads' ? (
                                            <img src='/assets/heads.png' alt='front' style={{ width: '225px', height: '225px' }} />
                                        ) : (
                                            <img src='/assets/tails.png' alt='front' style={{ width: '225px', height: '225px' }} />
                                        )
                                    }
                                </Item>
                                <Grid item container direction='row' justifyContent='space-between' sx={{ mt: 5 }}>
                                    <Button color='secondary' onClick={() => onClickSide('heads')} variant={side == 'heads' ? 'contained' : 'outlined'}
                                        sx={{
                                            width: '45%',
                                            height: '50px',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontSize: '20px'
                                        }}>
                                        Head
                                    </Button>
                                    <Button color='secondary' onClick={() => onClickSide('tails')} variant={side == 'tails' ? 'contained' : 'outlined'}
                                        sx={{
                                            width: '45%',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            height: '50px',
                                            fontSize: '20px'
                                        }}
                                    >
                                        Tail
                                    </Button>
                                </Grid>

                                <Item sx={{ mt: 5 }}>
                                    <Stack spacing={4} direction="row" sx={{ mb: 1, mt: 1, color: 'white', fontSize: '20px' }} alignItems="center">
                                        <div style={{ fontSize: '20px' }}>0.1N</div>
                                        <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            defaultValue={2}
                                            onChange={handleSliderChange}
                                            value={typeof playVal === 'number' ? playVal : 0}
                                            min={0.1}
                                            max={5}
                                            step={0.1}
                                        />
                                        <div style={{ fontSize: '20px' }}>5N</div>
                                    </Stack>
                                    <Stack spacing={3} direction="row" sx={{ mb: 1, mt: 2 }} alignItems="center" justifyContent="center">
                                        <Button color='secondary' variant={playVal == 1 ? 'contained' : 'outlined'} onClick={() => setSpecialVal(1)} sx={{ width: '20%', fontSize: '20px' }}>1N</Button>
                                        <Button color='secondary' variant={playVal == 2 ? 'contained' : 'outlined'} onClick={() => setSpecialVal(2)} sx={{ width: '20%', fontSize: '20px' }}>2N</Button>
                                        <Button color='secondary' variant={playVal == 5 ? 'contained' : 'outlined'} onClick={() => setSpecialVal(5)} sx={{ width: '20%', fontSize: '20px' }}>5N</Button>
                                    </Stack>
                                </Item>
                                <Button
                                    variant='contained'
                                    onClick={coinToss}
                                    sx={{ width: '100%', fontSize: '20px', width: '100%', mt: 5, color: 'white' }}
                                    color='secondary'
                                    size='large'
                                    className='Button'
                                >
                                    Flip&nbsp;<font style={{ color: 'yellow', fontSize: '20px' }}>{playVal}</font>
                                </Button>
                                {/* <Item sx={{ mt: 5 }}>
                                    
                                </Item> */}
                                <Grid item container direction='row' justifyContent='space-between' sx={{ mt: 5, p: 0 }}>
                                    <Button onClick={() => handleOpen('deposit')} color='secondary' variant='contained' sx={{ width: '45%', height: '50px', fontSize: '20px', color: 'white' }}>Deposit</Button>
                                    <Button onClick={() => handleOpen('withdraw')} color='secondary' variant='contained' sx={{ width: '45%', height: '50px', fontSize: '20px', color: 'white' }}>Withdraw</Button>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>

                    {/* <Grid item xs={12} container justifyContent='center' sx={{ mt: 7, }}>
                        <Grid
                            item
                            xs={9}
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            sx={{
                                backgroundColor: 'rgba(255,255,100, 0.2)',
                                borderRadius: 2
                            }}
                        >
                            <Button sx={{ fontWeight: '20px', color: 'white', textTransform: 'none', fontSize: '17px' }}>
                                Flip<br />Responsibly</Button>
                            <Button sx={{ fontWeight: '20px', color: 'white', textTransform: 'none', fontSize: '17px' }}>
                                How To <br />Play</Button>
                            <Button sx={{ fontWeight: '20px', color: 'white', textTransform: 'none', fontSize: '17px' }}>
                                FAQ</Button>
                        </Grid>
                    </Grid> */}
                    <Grid item xs={12} container justifyContent='center' sx={{ mt: 7 }} >
                        <Grid
                            item
                            xs={10}
                            sm={4}
                            md={3}
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"

                        >
                            <a href='https://twitter.com/PandamilNFT'><img src='/assets/twitter.png' style={{ width: '30px', height: '30px' }} /></a>
                            <a href='https://discord.gg/mQnZuysV4n'><img src='/assets/discord.png' style={{ width: '30px', height: '30px' }} /></a>
                            <a href='https://pandamillionaires.club/'><img src='/assets/panda.png' style={{ width: '35px', height: '30px' }} /></a>
                        </Grid>
                    </Grid>
                </Box>

                <FundModal open={open} handleClose={handleClose} type={fundType} />
            </div>
        </div >
    )
}

export default Main