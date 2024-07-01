import { Button, ButtonProps, Flex, FlexProps } from '@gobob/ui';
import { Discord, Twitter } from '@gobob/icons';

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
}: SocialsGroupProps): JSX.Element => (
  <Flex gap={gap} justifyContent={justifyContent} {...props}>
    {showDocs && (
      <Button asChild isIconOnly size='s' variant={variant}>
        <a href='https://docs.gobob.xyz/' rel='noreferrer' target='_blank'>
          Docs
        </a>
      </Button>
    )}
    <Button asChild isIconOnly size='s' variant={variant}>
      <a aria-label='navigate to X social' href='https://twitter.com/build_on_bob' rel='noreferrer' target='_blank'>
        <Twitter size='s' />
      </a>
    </Button>
    <Button asChild isIconOnly size='s' variant={variant}>
      <a aria-label='navigate to discord' href='https://discord.gg/gobob' rel='noreferrer' target='_blank'>
        <Discord size='s' />
      </a>
    </Button>
  </Flex>
);

export { SocialsGroup };
