import Image from "next/image";

const img = "/image.png";
const flecha = "/flecha-hacia-abajo.png";

const Welcome = () => {
  return (
    <>
    <div className="flex items-center justify-center py-20 px-20 ">
       <div className='animate-fade-right animate-once animate-duration-[1000ms] animate-delay-[1600ms]'>
        <Image className="animate-pulse animate-infinite animate-delay-[2750ms]" src={img} alt="pucmm logo" width={300} height={200}/>
        </div>
      <h1 className="text-6xl pl-10 font-[family-name:var(--font-kalnia-glaze)] animate-jump-in animate-once animate-duration-[1700ms]">Bienvenido al Salon de Belleza <br/>"La Puca" 💅💅</h1>
    </div>
    <div className="flex justify-center mt-20 animate-fade-down animate-once animate-delay-[2000ms]"><Image className="animate-bounce animate-infinite " src={flecha} alt="pucmm logo" width={200} height={200}/></div>

    </>
  )
}

export default Welcome
