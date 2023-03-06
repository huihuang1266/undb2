import type { OpenConfirmModal } from '@egodb/ui'
import { modalStyles } from '@egodb/ui'
import { Text } from '@egodb/ui'
import { openConfirmModal } from '@egodb/ui'
import { useTranslation } from 'react-i18next'

export const useConfirmModal = (props: OpenConfirmModal) => {
  const { t } = useTranslation()
  const open = () =>
    openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">You have unsaved changes. Do you really want to close the panel?</Text>,
      ...props,
      target: 'body',
      labels: { confirm: t('Confirm', { ns: 'common' }), cancel: t('Cancel', { ns: 'common' }) },
      confirmProps: Object.assign({ color: 'red' }, props.confirmProps),
      centered: true,
      styles: modalStyles,
    })

  return open
}
