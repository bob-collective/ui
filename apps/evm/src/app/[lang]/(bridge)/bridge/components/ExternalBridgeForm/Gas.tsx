import { forwardRef } from 'react';
import { Icon, IconProps } from '@gobob/ui';

const Gas = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} fill='none' viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect fill='#3A6EA5' height='2000' rx='1000' width='2000' />
    <path
      d='M1022.83 849.212L801.217 1189.58L1000.37 1189.77L978.028 1416.81L1199.64 1076.44L1000.48 1076.25L1022.83 849.212Z'
      stroke='white'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='35'
    />
    <path
      d='M1416.67 724.304C1396.08 714.058 1406.37 744.797 1416.67 724.304C1375 707.132 1416.67 778.301 1416.67 724.304C1416.37 724.888 1416.67 747.166 1416.67 724.304C1416.67 747.166 1393.7 724.304 1416.67 724.304V471.281C1416.67 379.812 1343.89 306 1251.99 306H751.99C660.091 306 583.333 379.812 583.333 471.281V1399.5L523.031 1429.51C508.911 1436.54 500 1450.89 500 1466.61V1591.02C500 1613.93 520.646 1633.1 543.656 1633.1H1460.32C1483.33 1633.1 1500 1613.93 1500 1591.02V1466.61C1500 1450.89 1491.09 1436.54 1476.97 1429.51L1416.67 1399.5V724.304C1416.67 670.308 1416.67 697.943 1416.67 724.304C1416.67 792.912 1415.59 717.404 1416.67 724.304ZM1416.67 1550.16H583.333V1492.24L643.635 1462.23C657.755 1455.21 666.667 1440.85 666.667 1425.13V471.279C666.667 425.535 706.029 388.944 751.99 388.944H1251.99C1297.95 388.944 1333.33 425.535 1333.33 471.281V1425.14C1333.33 1440.85 1342.24 1455.21 1356.36 1462.24L1416.67 1492.24V1550.16Z'
      fill='white'
    />
    <mask fill='white' id='path-4-inside-1_1_21'>
      <path d='M743 527C743 499.386 765.386 477 793 477H1207C1234.61 477 1257 499.386 1257 527V702C1257 729.614 1234.61 752 1207 752H793C765.386 752 743 729.614 743 702V527Z' />
    </mask>
    <path
      d='M683 527C683 474.533 725.533 432 778 432H1222C1274.47 432 1317 474.533 1317 527H1197C1197 524.239 1197 522 1197 522H803C803 522 803 524.239 803 527H683ZM1317 702C1317 754.467 1274.47 797 1222 797H778C725.533 797 683 754.467 683 702H803C803 704.761 803 707 803 707H1197C1197 707 1197 704.761 1197 702H1317ZM778 797C725.533 797 683 754.467 683 702V527C683 474.533 725.533 432 778 432L803 522C803 522 803 524.239 803 527V702C803 704.761 803 707 803 707L778 797ZM1222 432C1274.47 432 1317 474.533 1317 527V702C1317 754.467 1274.47 797 1222 797L1197 707C1197 707 1197 704.761 1197 702V527C1197 524.239 1197 522 1197 522L1222 432Z'
      fill='white'
      mask='url(#path-4-inside-1_1_21)'
    />
  </Icon>
));

Gas.displayName = 'Gas';

export { Gas };