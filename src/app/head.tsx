// import { Inter } from '@next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export default function Head() {
  return (
    <>
      <title>Polybase Auth</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Auth powered by Polybase" />
      {/* <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style> */}
      <link rel="icon" href="/favicon.ico" />
    </>
  )
}
