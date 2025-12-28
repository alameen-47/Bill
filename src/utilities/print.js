import Printer, { COMMANDS } from '@haroldtran/react-native-thermal-printer';

const receiptText =
  COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT + 'RECEIPT\n' +
  COMMANDS.TEXT_FORMAT.TXT_BOLD_ON + 'Item: Coffee\n' +
  COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF + 'Price: $5.00\n' +
  COMMANDS.HORIZONTAL_LINE.HR_58MM + '\n' +
  'Thank you!';

Printer.printText(receiptText);