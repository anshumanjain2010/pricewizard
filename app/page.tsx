import HeroCarousel from "@/components/HeroCarousel"
import Searchbar from "@/components/Searchbar"
import Image from "next/image"
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"

const Home= async () => {      //server function nextjs makes it simple. A way to access all the products
  const allProducts= await getAllProducts();

  return (
    <>
      <section className= "px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping begins Here:
              <Image 
              src="/assets/icons/arrow-right.svg"
              alt="arror-right"
              width={16}
              height={16}
              />
            </p>
            <h1 className="head-text">
              <span className="text-primary"> PriceWizard</span> is here to save money for you
            </h1>

            <p className="mt-6">
              Wizard is here to save money for you from the E-commerce websites.
            </p>

            <Searchbar/>
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product)=>(
            <ProductCard key={product._id} product= {product} />

          ))}
        </div>

      </section>
    </>
  )
}
export default Home