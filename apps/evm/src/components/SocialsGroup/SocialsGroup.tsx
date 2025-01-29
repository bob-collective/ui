import { Button, ButtonProps, Flex, FlexProps } from '@gobob/ui';
import { Discord, Twitter } from '@gobob/icons';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { ExternalLinks } from '@/constants';

type Props = {
  variant?: ButtonProps['variant'];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type SocialsGroupProps = Props & InheritAttrs;

const SocialsGroup = ({
  gap = 's',
  justifyContent = 'center',
  variant = 'outline',
  ...props
}: SocialsGroupProps): JSX.Element => {
  const { i18n } = useLingui();

  return (
    <Flex gap={gap} justifyContent={justifyContent} {...props}>
      <Button asChild isIconOnly size='s' variant={variant}>
        <a aria-label={t(i18n)`navigate to X social`} href={ExternalLinks.X} rel='noreferrer' target='_blank'>
          <Twitter size='s' />
        </a>
      </Button>
      <Button asChild isIconOnly size='s' variant={variant}>
        <a aria-label={t(i18n)`navigate to discord`} href={ExternalLinks.DISCORD} rel='noreferrer' target='_blank'>
          <Discord size='s' />
        </a>
      </Button>
    </Flex>
  );
};

export { SocialsGroup };
