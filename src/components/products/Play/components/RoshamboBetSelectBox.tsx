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

export default function RoshamboBetSelectBox({ selectedBet, betlist, placeholder, onSelectBet }: BetSelectBoxProps) {

    const getRoshamboFromNo = (num: number) => {
        if (num === 1) return "Rock"
        if (num === 2) return "Paper"
        if (num === 3) return "Scissors"        
        return "Rock"
    }

    const getRoshamboIcon = (index: number, height: string) => {
        switch (index) {
            case 0:
                return (
                    <img src="./images/play/rock.png" height={height} />
                )
            case 1:
                return (
                    <img src="./images/play/paper.png" height={height} />
                )
            case 2:
                return (
                    <img src="./images/play/scissors.png" height={height} />
                )
        }
    }

    return (
        <div className="flex flex-col rounded-2xl bg-[#06111C] py-3 px-5">            
            <div className="text-[12px] font-bold uppercase text-app-primary">
                Your Gesture
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
                                    <div className='w-[26px] h-[26px]'>
                                        {getRoshamboIcon(Number(selectedBet) - 1, "26px")}
                                    </div>
                                    <div className='pl-4 text-[18px]'>{getRoshamboFromNo(Number(selectedBet))}</div>
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
                                            {getRoshamboIcon(index, "36px")}
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
