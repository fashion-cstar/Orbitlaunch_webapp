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

export default function SpinBetSelectBox({ selectedBet, betlist, placeholder, onSelectBet }: BetSelectBoxProps) {

    const getSpinPlaceFromNo = (num: number) => {
        if (num === 1) return "Red"
        if (num === 2) return "Yellow"
        if (num === 3) return "Green"
        if (num === 4) return "Blue"
        return "Red"
    }

    const getWheelPlace = (index: number) => {
        switch (index) {
            case 0:
                return (<div className='rounded-full bg-[#e91e50] w-[32px] h-[32px] border border-2 border-white' />)
            case 1:
                return (<div className='rounded-full bg-[#ffc107] w-[32px] h-[32px] border border-2 border-white' />)
            case 2:
                return (<div className='rounded-full bg-[#3bff40] w-[32px] h-[32px] border border-2 border-white' />)
            case 3:
                return (<div className='rounded-full bg-[#0389ff] w-[32px] h-[32px] border border-2 border-white' />)
        }
    }

    const getWheelPlaceSmall = (index: number) => {
        switch (index) {
            case 0:
                return (<div className='rounded-full bg-[#e91e50] w-[22px] h-[22px] border border border-white' />)
            case 1:
                return (<div className='rounded-full bg-[#ffc107] w-[22px] h-[22px] border border border-white' />)
            case 2:
                return (<div className='rounded-full bg-[#3bff40] w-[22px] h-[22px] border border border-white' />)
            case 3:
                return (<div className='rounded-full bg-[#0389ff] w-[22px] h-[22px] border border border-white' />)
        }
    }

    return (
        <div className="flex flex-col rounded-2xl bg-[#06111C] py-3 px-5">
            <div className="text-[12px] font-bold uppercase text-app-primary">
                Your Place
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
                                        {getWheelPlaceSmall(Number(selectedBet) - 1)}
                                    </div>
                                    <div className='pl-4 text-[18px]'>{getSpinPlaceFromNo(Number(selectedBet))}</div>
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
                                        {getWheelPlace(index)}
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
