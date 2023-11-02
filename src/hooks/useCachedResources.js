import * as React from 'react';
import {useDispatch} from 'react-redux';
import {checkUser} from '../lib/slices/authSlice';
import {USER_TOKEN} from '../utils/auth.util';

export default function useCachedResources() {
  const dispatch = useDispatch();
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  const checkUserLogged = async () => {
    const userToken = await USER_TOKEN.get();
    if (!userToken) {
      return;
    }
    await dispatch(checkUser());
  };

  // Load any resources or data that we need prior to rendering the src
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await checkUserLogged();

        // Load fonts
        // await Font.loadAsync({
        //   ...Ionicons.font,
        //   'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        // });
      } catch (e) {
        setLoadingComplete(true);
        await USER_TOKEN.delete();
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
