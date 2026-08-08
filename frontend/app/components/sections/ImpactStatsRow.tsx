import {clsx} from 'clsx'
import Stat from '@/app/components/ui/Stat'
import Stagger from '@/app/components/motion/Stagger'
import StaggerItem from '@/app/components/motion/StaggerItem'
import {resolveIcon} from '@/app/lib/icons'

type Metric = {
  _id: string
  label?: string | null
  value?: string | null
  prefix?: string | null
  suffix?: string | null
  description?: string | null
  icon?: string | null
  category?: string | null
}

type Props = {
  metrics: Metric[]
  tone?: 'ink' | 'white' | 'accent'
  className?: string
}

export default function ImpactStatsRow({metrics, tone = 'ink', className}: Props) {
  if (!metrics?.length) return null

  return (
    <Stagger className={clsx('grid gap-10 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {metrics.map((metric) => {
        const Icon = resolveIcon(metric.icon)
        return (
          <StaggerItem key={metric._id}>
            <div className="flex flex-col gap-4">
              {Icon && (
                <Icon
                  className={clsx(
                    'h-6 w-6',
                    tone === 'white' ? 'text-accent' : 'text-primary',
                  )}
                  aria-hidden
                />
              )}
              <Stat
                value={metric.value || ''}
                label={metric.label || ''}
                prefix={metric.prefix}
                suffix={metric.suffix}
                description={metric.description}
                tone={tone}
              />
            </div>
          </StaggerItem>
        )
      })}
    </Stagger>
  )
}
