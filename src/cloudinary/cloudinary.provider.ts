import {v2 as cloudinary} from 'cloudinary';

export const CloudinaryProvider = {
    provide:'CLOUDINARY',
    useFactory: () =>{
        return cloudinary.config(
            {
                cloud_name: 'aridev21',
                api_key: '827353881855768',
                api_secret: 'uuBHm1UrXLwjSN_MDE1JjqrBml8'
            }
        )
    }
        
}