import { ArrowUp, ArrowDown, ArrowsUpDown } from '@gobob/ui';
import { Button, Flex } from '@gobob/ui';

type ButtonProps = {
  onPressBridge?: () => void;
  onPressSend: () => void;
  onPressReceive: () => void;
};

const ButtonGroupMobile = ({ onPressBridge, onPressReceive, onPressSend }: ButtonProps) => {
  return (
    <Flex direction='column' gap='s'>
      {onPressBridge && (
        <Button size='s' variant='ghost' onPress={onPressBridge}>
          <Flex alignItems='center' flex={1} gap='s' justifyContent='flex-start'>
            <ArrowsUpDown size='xs' strokeWidth={2} />
            Bridge
          </Flex>
        </Button>
      )}
      <Button size='s' variant='ghost' onPress={onPressSend}>
        <Flex alignItems='center' flex={1} gap='s' justifyContent='flex-start'>
          <ArrowUp size='xs' strokeWidth={2} />
          Send
        </Flex>
      </Button>
      <Button size='s' variant='ghost' onPress={onPressReceive}>
        <Flex alignItems='center' flex={1} gap='s' justifyContent='flex-start'>
          <ArrowDown size='xs' strokeWidth={2} />
          Receive
        </Flex>
      </Button>
      {/* <Button size='s' variant='outline'>
        Buy
      </Button> */}
    </Flex>
  );
};

export { ButtonGroupMobile };
