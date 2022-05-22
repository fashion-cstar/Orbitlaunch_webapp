import React, { useMemo, useState, useEffect } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { tierInformation } from 'src/shared/TierLevels'

interface TierSelectBoxProps {
    selectedTier: string
    userClaimedTier: number
    maxAvailableTier: number
    balanceTier: number
    onSelectTier: (event: SelectChangeEvent) => void
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

        }
    },
    PaperProps: {
        style: {
            maxHeight: '170px'
        },
    },
};

const MuiSelectStyle = {
    backgroundColor: '#06111c',
    borderRadius: '12px',
    height: '50px',
}

const MenuItemStyle = (isLast: boolean) => {
    return {
        borderBottom: isLast ? 'none' : '1px solid #001926',
        display: 'flex',
        alignItems: 'center',
        height: '50px',
        "&:last-child": {
            borderBottom: 'none'
        }
    }
}

export default function TierSelectBox({ selectedTier, userClaimedTier, maxAvailableTier, balanceTier, onSelectTier }: TierSelectBoxProps) {       
    const tierlist = tierInformation.map(item => ({ 'label': 'Tier ' + item.tierNo, value: item.tierNo, requiredTokens: item.requiredTokens, shownRequiredTokens: item.shownRequiredTokens }))

    return (
        <div className='w-full'>
            <FormControl fullWidth>
                <Select
                    displayEmpty
                    input={<OutlinedInput />}
                    inputProps={{ 'aria-label': 'Without label' }}
                    value={selectedTier}
                    onChange={onSelectTier}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <div className='text-[16px] text-[#BAB8CC]/[.48]'>Select your tier</div>;
                        }

                        return "Tier " + selectedTier;
                    }}
                    style={MuiSelectStyle}
                    MenuProps={MenuProps}
                >
                    <MenuItem disabled value="" style={{ display: 'none' }}>
                        <div className='text-[16px] text-[#BAB8CC]/[.48]'>Select your tier</div>
                    </MenuItem>
                    {
                        tierlist.map((item, index) => {
                            if (userClaimedTier > 0) {
                                if (userClaimedTier < item.value) {
                                    return (<MenuItem value={item.value} disabled style={MenuItemStyle(false)}>
                                        <div className='w-full flex justify-between items-center'>
                                            <div className='text-[16px] text-[#BAB8CC]/[.48]'>{item.label}</div>
                                            <div className='flex flex-col items-end'>
                                                <div className='text-[14px] text-[#BAB8CC]/[.48]'>{`Amount required: ${item.shownRequiredTokens} ORBIT`}</div>
                                                <div className='text-[12px] text-[#BAB8CC]/[.48]'>Downgrade not available</div>
                                            </div>
                                        </div>
                                    </MenuItem>)
                                } else {
                                    if (maxAvailableTier <= item.value) {
                                        return (<MenuItem value={item.value} style={MenuItemStyle(false)}>
                                            <div className='w-full flex justify-between items-center'>
                                                <div className='text-[16px] text-white'>{item.label}</div>
                                                <div className='text-[14px]'>
                                                    <span className='text-white'>Amount required: </span>
                                                    <span className='text-app-primary'>{`${item.shownRequiredTokens} ORBIT`}</span>
                                                </div>
                                            </div>
                                        </MenuItem>)
                                    } else {
                                        return (<MenuItem value={item.value} disabled style={MenuItemStyle(false)}>
                                            <div className='w-full flex justify-between items-center'>
                                                <div className='text-[16px] text-[#BAB8CC]/[.48]'>{item.label}</div>
                                                <div className='flex flex-col items-end'>
                                                    <div className='text-[14px] text-[#BAB8CC]/[.48]'>{`Amount required: ${item.shownRequiredTokens} ORBIT`}</div>
                                                    <div className='text-[12px] text-[#BAB8CC]/[.48]'>Purchase more tokens to upgrate to this tier</div>
                                                </div>
                                            </div>
                                        </MenuItem>)
                                    }
                                }
                            } else {
                                return (<MenuItem value={item.value} disabled={balanceTier >= (index + 1)} style={MenuItemStyle(false)}>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-[16px] text-white'>{item.label}</div>
                                        <div className='text-[14px]'>
                                            <span className='text-white'>Amount required: </span>
                                            <span className='text-app-primary'>{`${item.shownRequiredTokens} ORBIT`}</span>
                                        </div>
                                    </div>
                                </MenuItem>)
                            }
                        })
                    }
                </Select>
            </FormControl>
        </div>
    );
}
