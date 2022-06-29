import React, { useMemo, useState, useEffect } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface BetSelectBoxProps {
    selectedBet: string
    betlist: any[]
    placeholder: string
    onSelectBet: (event: SelectChangeEvent) => void
}

const MenuProps = {
    sx: {
        "ul": {
            backgroundColor: '#06111c',
        },
        "&& .Mui-selected": {
            backgroundColor: "linear-gradient(180deg, #161f35 -10%, #06111c 30%)"
        },
        "& .Mui-Root": {
        },
        "&& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
            borderWidth: "0px"
        },
    },
    field: {
        border: "none"
    },
    PaperProps: {
        style: {
            maxHeight: '120px'
        },
    },
};

const MuiSelectStyle = {
    backgroundColor: '#06111c',
    borderRadius: '12px',
    height: '30px',
}

const MenuItemStyle = (isLast: boolean) => {
    return {
        borderBottom: isLast ? 'none' : '1px solid #001926',
        display: 'flex',
        alignItems: 'center',
        height: '42px',
        "&:last-child": {
            borderBottom: 'none'
        }
    }
}

export default function DiceBetSelectBox({ selectedBet, betlist, placeholder, onSelectBet }: BetSelectBoxProps) {

    const getDiceFace = (index: number) => {
        switch (index) {
            case 0:
                return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" /><path fill="#fff" d="M74.5 36A38.5 38.5 0 0 0 36 74.5v363A38.5 38.5 0 0 0 74.5 476h363a38.5 38.5 0 0 0 38.5-38.5v-363A38.5 38.5 0 0 0 437.5 36h-363zM256 206a50 50 0 0 1 0 100 50 50 0 0 1 0-100z" /></svg>)
            case 1:
                return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" /><path fill="#fff" d="M74.5 36A38.5 38.5 0 0 0 36 74.5v363A38.5 38.5 0 0 0 74.5 476h363a38.5 38.5 0 0 0 38.5-38.5v-363A38.5 38.5 0 0 0 437.5 36h-363zm316.97 36.03A50 50 0 0 1 440 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm-268 268A50 50 0 0 1 172 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97z" /></svg>)
            case 2:
                return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" /><path fill="#fff" d="M74.5 36A38.5 38.5 0 0 0 36 74.5v363A38.5 38.5 0 0 0 74.5 476h363a38.5 38.5 0 0 0 38.5-38.5v-363A38.5 38.5 0 0 0 437.5 36h-363zm316.97 36.03A50 50 0 0 1 440 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zM256 206a50 50 0 0 1 0 100 50 50 0 0 1 0-100zM123.47 340.03A50 50 0 0 1 172 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97z" /></svg>)
            case 3:
                return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" /><path fill="#fff" d="M74.5 36A38.5 38.5 0 0 0 36 74.5v363A38.5 38.5 0 0 0 74.5 476h363a38.5 38.5 0 0 0 38.5-38.5v-363A38.5 38.5 0 0 0 437.5 36h-363zm48.97 36.03A50 50 0 0 1 172 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm268 0A50 50 0 0 1 440 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm-268 268A50 50 0 0 1 172 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm268 0A50 50 0 0 1 440 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97z" /></svg>)
            case 4:
                return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" /><path fill="#fff" d="M74.5 36A38.5 38.5 0 0 0 36 74.5v363A38.5 38.5 0 0 0 74.5 476h363a38.5 38.5 0 0 0 38.5-38.5v-363A38.5 38.5 0 0 0 437.5 36h-363zm48.97 36.03A50 50 0 0 1 172 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm268 0A50 50 0 0 1 440 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zM256 206a50 50 0 0 1 0 100 50 50 0 0 1 0-100zM123.47 340.03A50 50 0 0 1 172 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm268 0A50 50 0 0 1 440 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97z" /></svg>)
            case 5:
                return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" /><path fill="#fff" d="M74.5 36A38.5 38.5 0 0 0 36 74.5v363A38.5 38.5 0 0 0 74.5 476h363a38.5 38.5 0 0 0 38.5-38.5v-363A38.5 38.5 0 0 0 437.5 36h-363zm48.97 36.03A50 50 0 0 1 172 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm268 0A50 50 0 0 1 440 122a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zM122 206a50 50 0 0 1 0 100 50 50 0 0 1 0-100zm268 0a50 50 0 0 1 0 100 50 50 0 0 1 0-100zM123.47 340.03A50 50 0 0 1 172 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97zm268 0A50 50 0 0 1 440 390a50 50 0 0 1-100 0 50 50 0 0 1 51.47-49.97z" /></svg>)
        }
    }

    return (
        <div className="flex flex-col rounded-2xl bg-[#06111C] py-3 px-5">
            <div className="text-[12px] font-bold uppercase text-app-primary">
                Dice Number
            </div>
            <div className='flex gap-2 justify-between w-full mt-1'>
                <FormControl fullWidth variant="standard" sx={{ border: 'none' }}>
                    <Select
                        displayEmpty
                        // input={<OutlinedInput />}
                        inputProps={{ 'aria-label': 'Without label' }}
                        value={selectedBet}
                        onChange={onSelectBet}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <div className='text-[14px] text-[#BAB8CC]/[.48]'>{placeholder}</div>;
                            }

                            return (
                                <div className='w-full flex justify-start gap-4 items-center pl-4 pb-2'>
                                    <div className='w-[26px] h-[24px]'>
                                        {getDiceFace(Number(selectedBet)-1)}
                                    </div>
                                    <div className='pl-4 text-[18px]'>{selectedBet}</div>
                                </div>
                            )
                        }}
                        style={MuiSelectStyle}
                        MenuProps={MenuProps}
                    >
                        <MenuItem disabled value="" style={{ display: 'none' }}>
                            <div className='text-[16px] text-[#BAB8CC]/[.48]'>{placeholder}</div>
                        </MenuItem>
                        {
                            betlist.map((item, index) => {
                                return (<MenuItem value={item.value} style={MenuItemStyle(index === betlist.length - 1 ? true : false)} key={index}>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='w-[36px] h-[36px]'>
                                            {getDiceFace(index)}
                                        </div>
                                        <div className='text-[16px] text-white'>{item.label}</div>
                                    </div>
                                </MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}
