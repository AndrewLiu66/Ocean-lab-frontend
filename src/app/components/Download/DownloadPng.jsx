import React from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import { Button } from '@mui/material'
import { styled } from '@mui/system'
import { handleOutputName } from "app/utils/utils"
import axios from 'axios'
import fileDownload from 'js-file-download';

const StyledButton = styled(Button)(({ theme }) => ({
    width: '130px',
    marginRight: '10px',
    backgroundColor: '#008255',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const DownloadPng = ({currType, image, setLoading, startDate, endDate, location, frequency, selectedValue}) => {
    const outputName = handleOutputName(location, startDate, endDate, selectedValue)
    const DownloadPNG = () => {
        if(currType === 'SPDF') {
            const linkSource = `data:image/jpeg;base64,${image}`
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = `${outputName}.png`;
            downloadLink.click();
        } else
        {
            if (selectedValue === "CTD")
            {
                currType = "CTD"
            }
            setLoading(true)
            axios({
                method: 'post',
                url: '/api/downloadPng',
                responseType: 'blob',
                data: {
                    startDate,
                    endDate,
                    location,
                    currType,
                    frequency
                }
            }).then((res) => {
                setLoading(false)
                fileDownload(res.data, `${outputName}.png`);
            });
        }
    }


    return (
        <StyledButton
            variant="contained"
            onClick={DownloadPNG}
        >
            <DownloadIcon sx={{ mr: 1 }} />
            PNG
        </StyledButton>
    )
}

export default DownloadPng
