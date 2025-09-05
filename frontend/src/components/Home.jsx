import Banner from "./Baner"
import Hero from "./Hero"
import Products from "./Products"

function Home() {
    return <div>
        <Hero/>
        <Products/>
        <div>
            <Banner 
                img1={"https://static.wixstatic.com/media/c837a6_0fc32a0ee56d4d4d9efdbc71fc6bee38~mv2.jpg/v1/crop/x_0,y_908,w_2000,h_2092/fill/w_705,h_673,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/olesia-bahrii-O26_pLuR0Is-unsplash.jpg"}
                img2={"https://static.wixstatic.com/media/c837a6_74a82313c3fd4f27b5fc49781069273f~mv2.jpg/v1/crop/x_1017,y_517,w_1533,h_1409/fill/w_705,h_673,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/clay-banks-es8CZ7rMbvU-unsplash_edited.jpg"}
                />
        </div>
        <Products/>
    </div>
}


export default Home