import { Button, ButtonProps, Flex, FlexProps } from '@gobob/ui';
import { Discord, Twitter } from '@gobob/icons';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { DocsLinks } from '@/constants';

type Props = {
  showDocs?: boolean;
  variant?: ButtonProps['variant'];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type SocialsGroupProps = Props & InheritAttrs;

const SocialsGroup = ({
  showDocs,
  gap = 's',
  justifyContent = 'center',
  variant = 'outline',
  ...props
}: SocialsGroupProps): JSX.Element => {
  const { i18n } = useLingui();

  return (
    <Flex gap={gap} justifyContent={justifyContent} {...props}>
      {showDocs && (
        <Button asChild isIconOnly size='s' variant={variant}>
          <a href={DocsLinks.HOME} rel='noreferrer' target='_blank'>
            <Trans>Docs</Trans>
          </a>
        </Button>
      )}
      <Button asChild isIconOnly size='s' variant={variant}>
        <a
          aria-label={t(i18n)`navigate to X social`}
          href='https://x.com/build_on_bob'
          rel='noreferrer'
          target='_blank'
        >
          <Twitter size='s' />
        </a>
      </Button>
      <Button asChild isIconOnly size='s' variant={variant}>
        <a aria-label={t(i18n)`navigate to discord`} href='https://discord.gg/gobob' rel='noreferrer' target='_blank'>
          <Discord size='s' />
        </a>
      </Button>
    </Flex>
  );
};

export { SocialsGroup };
