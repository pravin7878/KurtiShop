import { useEffect } from "react"
import Banner from "../components/Baner"
import Hero from "../components/Hero"
import { useDispatch } from "react-redux"
import { fetchProducts } from "../app/actions/product"
import TopProducts from "../components/TopProducts "

function Home() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch]);

    return <div>
        <Hero />
        <TopProducts/>
        <div>
            <Banner
                img1={"https://static.wixstatic.com/media/c837a6_0fc32a0ee56d4d4d9efdbc71fc6bee38~mv2.jpg/v1/crop/x_0,y_908,w_2000,h_2092/fill/w_705,h_673,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/olesia-bahrii-O26_pLuR0Is-unsplash.jpg"}
                img2={"https://static.wixstatic.com/media/c837a6_74a82313c3fd4f27b5fc49781069273f~mv2.jpg/v1/crop/x_1017,y_517,w_1533,h_1409/fill/w_705,h_673,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/clay-banks-es8CZ7rMbvU-unsplash_edited.jpg"}
            />
        </div>
        <TopProducts/>
    </div>
}


export default Home