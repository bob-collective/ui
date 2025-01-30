import { Modal, ModalBody, ModalHeader } from '@gobob/ui';
import { useStore } from '@tanstack/react-store';
import { Turnstile } from '@marsidev/react-turnstile';
import { Trans } from '@lingui/macro';

import { store } from '@/lib/store';

const TurnstileModal = () => {
  const { isOpen, onSuccess } = useStore(store, (state) => state.shared.turnstile);

  const handleSuccess = (token: string) => {
    onSuccess?.(token);

    store.setState((s) => ({ ...s, shared: { ...s.shared, turnstile: { isOpen: false, token } } }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => store.setState((s) => ({ ...s, shared: { ...s.shared, turnstile: { isOpen: false } } }))}
    >
      <ModalHeader>
        <Trans>Verify you are human</Trans>
      </ModalHeader>
      <ModalBody>
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onSuccess={handleSuccess}
        />
      </ModalBody>
    </Modal>
  );
};

export { TurnstileModal };
