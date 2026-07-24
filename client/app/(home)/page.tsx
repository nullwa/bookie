import { Nav } from '@/common/components/nav'
import { Hero } from '@/common/components/hero'
import { CallToAction } from '@/common/components/call-to-action'
import { ServiceExplore } from '@/common/components/service-explore'
import { Platform } from '@/common/components/platfrom'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ServiceExplore
        items={[
          { id: 1, label: 'Beauty salons', image: 'https://images.ctfassets.net/2d5q1td6cyxq/2G1KL3MPpLXync6nFtHffM/7509ea438b7d65b4e5eb405bcdd13526/PD07338_USEN-ES_Card_1.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 2, label: 'Barbershops', image: 'https://images.ctfassets.net/2d5q1td6cyxq/tM53RHm0PCPi0JeVDNvFG/3442196d523c0d141b2b014c6b87ba72/PD07338_USEN-ES_Card_2.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 3, label: 'Hair salons', image: 'https://images.ctfassets.net/2d5q1td6cyxq/Px7qJWysr8xGOtagMGnre/371e83feeae33c4d8dd5ae1fd5f009f0/PD07338_USEN-ES_Card_3.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 4, label: 'Nail salons', image: 'https://images.ctfassets.net/2d5q1td6cyxq/3RO4pVpNlH3W4ovZvDMhzM/4e101401a12f1ffb29d1648bf3a44fea/PD07338_USEN-ES_Card_4.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 5, label: 'Day spas', image: 'https://images.ctfassets.net/2d5q1td6cyxq/7xufsldsT1kAAy7sx7vdOr/3b4162968cc7ba9be68565c0d2f3bca8/PD07338_USEN-ES_Card_5.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 6, label: 'Tattoo & piercing', image: 'https://images.ctfassets.net/2d5q1td6cyxq/4eXblIc2XINOe6E31lzI0F/36d4a702bdc43c9ab1378403ac36d984/PD07338_USEN-ES_Card_6.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 7, label: 'Med spas', image: 'https://images.ctfassets.net/2d5q1td6cyxq/7qLfXfviKccUqZ18cDHuX4/615536490429859b193d830cb64625ab/PD07338_USEN-ES_Card_7.png?fm=avif&q=85&fit=fill&w=710' },
        ]}
      />{' '}
      <Platform />
      <CallToAction />
    </main>
  )
}
