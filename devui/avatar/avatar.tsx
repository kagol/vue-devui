import { defineComponent, watch, toRefs, ref } from 'vue';

import AvatarBodyIcon from './avatar-body-icon';
import AvatarNoBodyIcon from './avatar-nobody-icon'

import './avatar.scss';

export default defineComponent({
  name: 'd-avatar',
  props: {
    name: {
      type: String,
      default: null
    },
    gender: {
      type: String as () => 'male' | 'female' | string,
      default: null
    },
    width: {
      type: Number,
      default: 36
    },
    height: {
      type: Number,
      default: 36
    },
    isRound: {
      type: Boolean,
      default: true
    },
    imgSrc: {
      type: String
    },
    customText: {
      type: String,
      default: null
    }
  },
  setup(props, ctx) {
    const { name, width, height, customText, gender, imgSrc, isRound } = toRefs(props);
    const isNobody = ref<boolean>(true);
    const isErrorImg = ref<boolean>(false);
    const fontSize = ref<number>(12);
    const code = ref<number>();
    const nameDisplay = ref<string>();
    const calcValues = (nameInput: string): void => {
      const userName = nameInput;
      const minNum  = Math.min(width.value, height.value);
      if (userName) {
        isNobody.value = false;
        setDisplayName(userName, minNum);
      } else if (userName === '') {
        isNobody.value = false;
        nameDisplay.value = '';
      } else {
        isNobody.value = true;
      }
      fontSize.value = minNum / 4 + 3;
    }

    const setDisplayName = (name: string, width: number): void => {
      if (customText.value) {
        nameDisplay.value = customText.value;
        getBackgroundColor(customText.value.substr(0, 1));
        return;
      }
      if (name.length < 2) {
        nameDisplay.value = name;
      } else {
        // 以中文开头显示最后两个字符
        if (/^[\u4e00-\u9fa5]/.test(name)) {
          nameDisplay.value = name.substr(name.length - 2, 2);
          // 英文开头
        } else if (/^[A-Za-z]/.test(name)) {
          // 含有两个及以上，包含空格，下划线，中划线分隔符的英文名取前两个字母的首字母
          if (/[_ -]/.test(name)) {
            const str_before = name.split(/_|-|\s+/)[0];
            const str_after = name.split(/_|-|\s+/)[1];
            nameDisplay.value = str_before.substr(0, 1).toUpperCase() + str_after.substr(0, 1).toUpperCase();
          } else {
            // 一个英文名的情况显示前两个字母
            nameDisplay.value = name.substr(0,2).toUpperCase();
          }
        } else {
          // 非中英文开头默认取前两个字符
          nameDisplay.value = name.substr(0, 2);
        }
      }
      if (width < 30) {
        nameDisplay.value = name.substr(0, 1).toUpperCase();
      }
      getBackgroundColor(name.substr(0, 1))
    }

    const getBackgroundColor = (char: string): void => {
      if (gender.value) {
        if(gender.value.toLowerCase() === 'male') {
          code.value = 1;
        } else if (gender.value.toLowerCase() === 'female') {
          code.value = 0;
        } else {
          throw new Error('gender must be "Male" or "Female"');
        }
      }
      const unicode = char.charCodeAt(0);
      code.value = unicode % 2;
    }
    const showErrorAvatar = (): void => {
      isErrorImg.value = true;
    }

    

    calcValues(customText.value ? customText.value : name.value);

    watch([name, width, height, customText, gender], () => {
      calcValues(customText.value ? customText.value : name.value);
    })
    
    return () => {
      const hasImgSrc = imgSrc?.value && !isErrorImg.value ? <img src={imgSrc?.value} alt="" onError={showErrorAvatar} style={{height: `${height.value}px`, width: `${width.value}px`, borderRadius: isRound.value ? '100%' : '0'}}/> : null;

      const hasNameDisplay = !imgSrc?.value && !isNobody.value && nameDisplay.value?.length !== 0 ? <span class={`devui-avatar-style devui-avatar-background-${code.value}`} style={{height: `${height.value}px`, width: `${width.value}px`, lineHeight: `${height.value}px`, fontSize: `${fontSize.value}px`, borderRadius: isRound.value ? '100%' : '0'}}>
        {nameDisplay.value}
      </span> : null;

      const hasNoDisplayName = !imgSrc?.value && !isNobody.value && nameDisplay.value?.length === 0 ? <span class={`devui-avatar-style`} style={{borderRadius: isRound.value ? '100%' : '0'}}>
        <AvatarBodyIcon width={width.value} height={height.value}></AvatarBodyIcon>
      </span> : null;

      const noBody = (!imgSrc?.value && isNobody.value) ||isErrorImg.value ? <span class={`devui-avatar-style`} style={{borderRadius: isRound.value ? '100%' : '0'}}>
        <AvatarNoBodyIcon width={width.value} height={height.value}></AvatarNoBodyIcon>
      </span> : null; 
      return (
        <span class="devui-avatar">
          { hasImgSrc }
          { hasNameDisplay }
          { hasNoDisplayName }
          { noBody }
        </span>
      )
    }
  }
})