import type { GetStaticPaths, GetStaticProps } from 'next'

interface Props {
  uuid: string
}

function Page({ uuid }: Props) {
  return (
    <div
      style={{
        width: '100vw',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem',
      }}
    >
      Random number generated on the server: {uuid}
    </div>
  )
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getStaticProps: GetStaticProps<
  Props,
  { revalidate: string }
> = async ({ params }) => {
  await sleep(10 * 1e3) // wait for 10s

  const revalidate = Number(params?.revalidate ?? '0')
  const uuid = (Math.random() * 1e3).toFixed(0)

  return {
    props: {
      uuid,
    },
    revalidate: revalidate || false,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Page
