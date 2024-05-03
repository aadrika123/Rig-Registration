export default function ulb_data () {
    let type = 'ranchi'
    const ulb = {
        akola: {
            brand_tag: "AMC",
            brand_name: "Akola Municipal Corporation",
            ulb_name: "Akola Municipal Corporation",
            district: "Akola",
            city: "Akola",
            state: "Maharashtra",
            address: "PX5X+356 Akola Municipal Corporation Headquarters, inside Municipal corporation, New Radhakisan Plots, Akola, Maharashtra 444002",
            mobile_no: "07242434412",
            mobile_no_2: "06513500700",
            email: "amcakola@yahoo.co.in",
            website: "https://amcakola.in",
            brand_logo: 'https://aadrikainfomedia.com/auth/Uploads/Icon/akola.png',
            brand_logo:'https://res.cloudinary.com/djkewhhqs/image/upload/v1709034287/JUIDCO_IMAGE/ULB%20Logo/rmc_Logo_nqr7xn.jpg',
            state_logo: 'https://jharkhandegovernance.com/Uploads/Icon/akola.png',
            state_logo: "https://jharkhandegovernance.com/egov-backend/Uploads/Icon/jharkhand.png",
            ulb_logo: 'http://203.129.217.246:8000/Uploads/Icon/akola.png',
            loader_logo: 'http://203.129.217.246:8000/Uploads/Icon/akola.png',
            ulb_parent_website: 'https://akola.gov.in/',
        },

        ranchi: {
            brand_tag: "UD&HD",
            brand_name: "Urban Development & Housing Department",
            ulb_name: "Ranchi Municipal Corporation",
            district: "Ranchi",
            city: "Ranchi",
            state: "Jharkhand",
            address: "4th Floor Project Building, Dhurwa Ranchi",
            mobile_no: "18008904115",
            mobile_no_2: "06513500700",
            website: "udhd.jharkhand.gov.in",
            email: "ud.secy@gmail.com",
            brand_logo:'https://jharkhandegovernance.com/egov-backend/Uploads/Icon/jharkhand.png',
            state_logo: "https://jharkhandegovernance.com/egov-backend/Uploads/Icon/jharkhand.png",
            ulb_logo: 'https://res.cloudinary.com/djkewhhqs/image/upload/v1709034287/JUIDCO_IMAGE/ULB%20Logo/rmc_Logo_nqr7xn.jpg',
            loader_logo: 'http://203.129.217.246:8000/Uploads/Icon/udhd.svg',
            ulb_parent_website: 'https://akola.gov.in/',
        },
    }
    return ulb[type];


}