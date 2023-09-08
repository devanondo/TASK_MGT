import axios from 'axios'
import React, { ChangeEvent } from 'react'

interface IImgbbUpload {
    onChange: (url: string) => void
}

const ImgbbUpload: React.FC<IImgbbUpload> = ({ onChange }) => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        handleUpload(file || null)
    }

    const handleUpload = async (file: File | null) => {
        if (!file) {
            alert('Please select a file to upload.')
            return
        }

        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await axios.post(
                'https://api.imgbb.com/1/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    params: {
                        key: 'ac244a0b209ddddb38ede02278d086bc', // Replace with your imgBB API key
                    },
                }
            )

            const url = response.data.data.url

            onChange(url)
        } catch (error) {
            console.error('Error uploading image:', error)
        }
    }

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
    )
}

export default ImgbbUpload
