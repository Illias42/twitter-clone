import {useEffect, useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import debounce from "lodash/debounce";
import {RootState} from "../redux/store";

interface IUseLazyLoad {
    trigger: any,
    getData?: any,
    options?: any
}

const useLazyLoad = ({trigger, getData, options}: IUseLazyLoad) => {
    const state = useSelector((state: RootState) => state.tweets);
    const [lastTweet, setLast] = useState<number>(0);

    const _handleEntry = async (entry: any) => {
        const boundingRect = entry.boundingClientRect;
        const intersectionRect = entry.intersectionRect;

        if (!state.loading && entry.isIntersecting && intersectionRect.bottom - boundingRect.bottom <= 5) {
            getData(lastTweet, 5);
            setLast(lastTweet + 5);
        }
    }

    const handleEntry = debounce(_handleEntry, 500);

    const onIntersect = useCallback(
        (entries) => {
            handleEntry(entries[0]);
        },
        [handleEntry]
    );

    useEffect(() => {
        if (trigger.current) {
            const container = trigger.current;
            const observer = new IntersectionObserver(onIntersect, options);

            observer.observe(container);

            return () => {
                observer.disconnect();
            }
        }
    }, [trigger, onIntersect, options]);
}

export default useLazyLoad;