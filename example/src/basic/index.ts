import JoinChannelVideo from './JoinChannelVideo';
import JoinChannelAudio from './JoinChannelAudio';
import Whiteboard from './Whiteboard';
import ScreenShare from './ScreenShare';

const Basic = {
  data: [
    {
      name: 'JoinChannelAudio',
      component: JoinChannelAudio,
    },
    {
      name: 'JoinChannelVideo',
      component: JoinChannelVideo,
    },
    {
      name: 'Whiteboard',
      component: Whiteboard,
    },
    {
      name: 'ScreenShare',
      component: ScreenShare,
    },
  ],
};

export default Basic;
