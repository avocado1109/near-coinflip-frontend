import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

import '../page/Main.scss'

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

const FundModal = (props) => {
    const [successFlag, setSuccessFlag] = useState(false)

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

    const onSuccess = () => {
        if (props.type == 'deposit') {
            setSuccessFlag(true)
            setTimeout(() => {
                setSuccessFlag(false)
            }, 1000)
            // clearTimeout(timer)
            // setSuccessFlag(false)
        }

    }
    console.log('success: ', successFlag)
    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {
                            props.type == 'deposit' ? 'Deposit' : 'Withdraw'
                        }
                    </Typography>
                    {
                        props.type === 'deposit' &&
                        <img src='/assets/money.gif' alt='get money' className='money' style={{ visibility: successFlag ? 'visible' : 'hidden' }} />
                    }

                    <FormControl fullWidth sx={{ mt: 2 }} variant="filled">
                        <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
                        <FilledInput
                            id="filled-adornment-amount"
                            value={values.amount}
                            onChange={handleChange('amount')}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                        <Button
                            color='secondary' variant='contained' sx={{ mt: 2 }}
                            onClick={() => onSuccess()}
                        >
                            {
                                props.type == 'deposit' ? 'Deposit' : 'Withdraw'
                            }
                        </Button>
                    </FormControl>
                </Box>
            </Modal>
        </div>
    )
}

export default FundModal