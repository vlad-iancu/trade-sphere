import Link from 'next/link'
import Modal from '../components/Modal'

export default function Layout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
  console.log(`Is modal null? ${modal === null}`)
  return (
    <>
      {children}
      {modal}
    </>
  )
}