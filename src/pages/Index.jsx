import React, { useState, useRef, useEffect } from 'react';
import backgroundImage from '../assets/background.png';
import keyboardIconImage from '../assets/键盘icon.png';
import settlementBackgroundImage from '../assets/结算底色.png';
import splashBackgroundImage from '../assets/星星水波纹.gif';
import starLightImage from '../assets/星光.gif';
import lakeHeartBackgroundImage from '../assets/湖心手记 底色.png';
import photoImage from '../assets/照片.png';
import { chatWithBot } from '../utils/cozeApi';
import { CozeConfigDialog } from '../components/CozeConfigDialog';

// 导入16人格图片
import INTJImage from '../assets/16人格/INTJ@1x.png';
import INTPImage from '../assets/16人格/INTP@1x.png';
import ENTJImage from '../assets/16人格/ENTJ@1x.png';
import ENTPImage from '../assets/16人格/ENTP@1x.png';
import INFJImage from '../assets/16人格/INFJ@1x.png';
import INFPImage from '../assets/16人格/INFP@1x.png';
import ENFJImage from '../assets/16人格/ENFJ@1x.png';
import ENFPImage from '../assets/16人格/ENFP@1x.png';
import ISTJImage from '../assets/16人格/ISTJ@1x.png';
import ISFJImage from '../assets/16人格/ISFJ@1x.png';
import ESTJImage from '../assets/16人格/ESTJ@1x.png';
import ESFJImage from '../assets/16人格/ESFJ@1x.png';
import ISTPImage from '../assets/16人格/ISTP@1x.png';
import ISFPImage from '../assets/16人格/ISFP@1x.png';
import ESTPImage from '../assets/16人格/ESTP@1x.png';
import ESFPImage from '../assets/16人格/ESFP@1x.png';

const Index = () => {
  // 调试：确认组件已加载
  useEffect(() => {
    console.log('✅ Index 组件已加载，showSplashPage:', true);
  }, []);
  
  const [showSplashPage, setShowSplashPage] = useState(true); // 启动页状态
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSecondPage, setShowSecondPage] = useState(false);
  const [showThirdPage, setShowThirdPage] = useState(false);
  const [showStarPage, setShowStarPage] = useState(false); // 星光页面状态
  const [showFourthPage, setShowFourthPage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 星光页文本显示相关状态
  const [starPageTextIndex, setStarPageTextIndex] = useState(0); // 当前显示的文本索引
  const starPageTexts = [
    '触摸湖底的旅程',
    '感谢你的勇敢和坦诚',
    '所见之物，是内心世界的映像',
    '静水流深'
  ];
  const [mbtiIndex, setMbtiIndex] = useState(0); // MBTI选择器的当前索引（保留用于兼容）
  // 新的MBTI字母选择器状态：4列，每列可以选择第一行(0)或第二行(1)
  const [mbtiColumnIndices, setMbtiColumnIndices] = useState([1, 0, 1, 0]); // 初始状态：E(第二行), N(第一行), T(第二行), P(第一行)
  const [mbtiColumnDragOffsets, setMbtiColumnDragOffsets] = useState([0, 0, 0, 0]); // 每列的拖拽偏移
  const [mbtiColumnTouchStarts, setMbtiColumnTouchStarts] = useState([null, null, null, null]); // 每列的触摸起始位置
  const [mbtiColumnIsDragging, setMbtiColumnIsDragging] = useState([false, false, false, false]); // 每列是否正在拖拽
  const [isExitingSecondPage, setIsExitingSecondPage] = useState(false); // 第二页退出动画状态
  const [isExitingSplashPage, setIsExitingSplashPage] = useState(false); // 启动页退出动画状态
  const [isExitingFirstPage, setIsExitingFirstPage] = useState(false); // 第一页退出动画状态
  const [isExitingThirdPage, setIsExitingThirdPage] = useState(false); // 第三页退出动画状态
  const [isExitingStarPage, setIsExitingStarPage] = useState(false); // 星光页面退出动画状态
  const [showStarAnimation, setShowStarAnimation] = useState(false); // 星光动画显示状态
  const [isEnteringLakeHeart, setIsEnteringLakeHeart] = useState(false); // 正在进入湖心（加载中）状态
  const [showFirstPageBackground, setShowFirstPageBackground] = useState(false); // 第一页背景图片显示状态
  const [showSecondPageBackground, setShowSecondPageBackground] = useState(false); // 第二页背景图片显示状态
  const [showThirdPageBackground, setShowThirdPageBackground] = useState(false); // 第三页背景图片显示状态
  const [showStarPageBackground, setShowStarPageBackground] = useState(false); // 星光页背景图片显示状态
  const [showFourthPageBackground, setShowFourthPageBackground] = useState(false); // 湖心页背景图片显示状态
  const [hasShownThirdPageTitle, setHasShownThirdPageTitle] = useState(false); // 第三页标题是否已显示过
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [mouseStart, setMouseStart] = useState(null);
  const [mouseEnd, setMouseEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);

  // 语音输入相关状态
  const [isHoldingGradient, setIsHoldingGradient] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [botReply, setBotReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingReply, setIsFetchingReply] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [extractedQuestion, setExtractedQuestion] = useState('');
  const [extractedOptions, setExtractedOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(new Set()); // 支持多选
  const [conversationHistory, setConversationHistory] = useState([]); // 对话历史记录
  const [rawCozeResponse, setRawCozeResponse] = useState(''); // Coze 原始返回内容
  const [showRawResponse, setShowRawResponse] = useState(false); // 是否显示原始返回内容
  const [lakeHeartContent, setLakeHeartContent] = useState(''); // 湖心页面的内容
  const [lakeHeartRawResponse, setLakeHeartRawResponse] = useState(''); // 湖心页面的原始返回内容
  const [showLakeHeartRawResponse, setShowLakeHeartRawResponse] = useState(false); // 是否显示湖心原始返回内容
  const [lakeHeartSections, setLakeHeartSections] = useState({
    m1: '', // M1内容
    m2: '', // M2内容
    m3: '', // M3内容
    m4: '' // M4内容
  }); // 湖心页面解析后的四段内容
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const gradientRef = useRef(null);
  const thirdPageContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const accumulatedTranscriptRef = useRef('');
  const messagesEndRef = useRef(null); // 用于滚动到底部
  const lastUserMessageRef = useRef(null); // 用于滚动到用户最新消息
  const scrollContainerRef = useRef(null); // 滚动容器ref
  const [showCozeConfigDialog, setShowCozeConfigDialog] = useState(false); // Coze 配置对话框状态
  
  // Coze API 配置已移至 src/utils/cozeApi.js

  // 16张图片数据
  const images = [
    { id: 1, name: 'INTJ', url: INTJImage },
    { id: 2, name: 'INTP', url: INTPImage },
    { id: 3, name: 'ENTJ', url: ENTJImage },
    { id: 4, name: 'ENTP', url: ENTPImage },
    { id: 5, name: 'INFJ', url: INFJImage },
    { id: 6, name: 'INFP', url: INFPImage },
    { id: 7, name: 'ENFJ', url: ENFJImage },
    { id: 8, name: 'ENFP', url: ENFPImage },
    { id: 9, name: 'ISTJ', url: ISTJImage },
    { id: 10, name: 'ISFJ', url: ISFJImage },
    { id: 11, name: 'ESTJ', url: ESTJImage },
    { id: 12, name: 'ESFJ', url: ESFJImage },
    { id: 13, name: 'ISTP', url: ISTPImage },
    { id: 14, name: 'ISFP', url: ISFPImage },
    { id: 15, name: 'ESTP', url: ESTPImage },
    { id: 16, name: 'ESFP', url: ESFPImage },
  ];

  // MBTI类型列表
  const mbtiTypes = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'];
  
  // 新的MBTI字母选择器：第一行和第二行
  const mbtiRow1 = ['I', 'N', 'F', 'P']; // 第一行
  const mbtiRow2 = ['E', 'S', 'T', 'J']; // 第二行
  const minDragDistance = 30; // 最小拖拽距离

  // 触摸滑动处理
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setDragOffset(0);
  };

  const onTouchMove = (e) => {
    if (touchStart !== null) {
      const currentX = e.targetTouches[0].clientX;
      const offset = touchStart - currentX;
      setDragOffset(offset);
    }
  };

  const onTouchEnd = () => {
    if (touchStart === null) return;
    const distance = Math.abs(dragOffset);
    const isLeftSwipe = dragOffset > 0;
    const isRightSwipe = dragOffset < 0;

    if (distance > minSwipeDistance) {
      if (isLeftSwipe && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (isRightSwipe && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    setTouchStart(null);
    setDragOffset(0);
  };

  // MBTI选择器的滑动处理（旧版，保留用于兼容）
  const [mbtiTouchStart, setMbtiTouchStart] = useState(null);
  const [mbtiDragOffset, setMbtiDragOffset] = useState(0);
  const [mbtiMouseStart, setMbtiMouseStart] = useState(null);
  const [mbtiIsDragging, setMbtiIsDragging] = useState(false);
  
  // 新的MBTI字母选择器处理函数
  const handleColumnTouchStart = (columnIndex, e) => {
    const newTouchStarts = [...mbtiColumnTouchStarts];
    newTouchStarts[columnIndex] = e.targetTouches[0].clientY;
    setMbtiColumnTouchStarts(newTouchStarts);
    
    const newDragOffsets = [...mbtiColumnDragOffsets];
    newDragOffsets[columnIndex] = 0;
    setMbtiColumnDragOffsets(newDragOffsets);
  };
  
  const handleColumnTouchMove = (columnIndex, e) => {
    if (mbtiColumnTouchStarts[columnIndex] !== null) {
      const currentY = e.targetTouches[0].clientY;
      const offset = mbtiColumnTouchStarts[columnIndex] - currentY;
      const newDragOffsets = [...mbtiColumnDragOffsets];
      newDragOffsets[columnIndex] = offset;
      setMbtiColumnDragOffsets(newDragOffsets);
    }
  };
  
  const handleColumnTouchEnd = (columnIndex) => {
    if (mbtiColumnTouchStarts[columnIndex] === null) return;
    
    const distance = Math.abs(mbtiColumnDragOffsets[columnIndex]);
    const isUpSwipe = mbtiColumnDragOffsets[columnIndex] > 0;
    const isDownSwipe = mbtiColumnDragOffsets[columnIndex] < 0;
    
    // 字母间距大约80px，如果拖拽超过30px就切换
    if (distance > minDragDistance) {
      const newIndices = [...mbtiColumnIndices];
      if (isUpSwipe && newIndices[columnIndex] === 1) {
        newIndices[columnIndex] = 0; // 向上滑动，切换到第一行
      } else if (isDownSwipe && newIndices[columnIndex] === 0) {
        newIndices[columnIndex] = 1; // 向下滑动，切换到第二行
      }
      setMbtiColumnIndices(newIndices);
    }
    
    const newTouchStarts = [...mbtiColumnTouchStarts];
    newTouchStarts[columnIndex] = null;
    setMbtiColumnTouchStarts(newTouchStarts);
    
    const newDragOffsets = [...mbtiColumnDragOffsets];
    newDragOffsets[columnIndex] = 0;
    setMbtiColumnDragOffsets(newDragOffsets);
    
    const newIsDragging = [...mbtiColumnIsDragging];
    newIsDragging[columnIndex] = false;
    setMbtiColumnIsDragging(newIsDragging);
  };
  
  const handleColumnMouseDown = (columnIndex, e) => {
    e.preventDefault();
    const newIsDragging = [...mbtiColumnIsDragging];
    newIsDragging[columnIndex] = true;
    setMbtiColumnIsDragging(newIsDragging);
    
    const newTouchStarts = [...mbtiColumnTouchStarts];
    newTouchStarts[columnIndex] = e.clientY;
    setMbtiColumnTouchStarts(newTouchStarts);
    
    const newDragOffsets = [...mbtiColumnDragOffsets];
    newDragOffsets[columnIndex] = 0;
    setMbtiColumnDragOffsets(newDragOffsets);
  };
  
  const handleColumnMouseMove = (columnIndex, e) => {
    if (!mbtiColumnIsDragging[columnIndex] || mbtiColumnTouchStarts[columnIndex] === null) return;
    const offset = mbtiColumnTouchStarts[columnIndex] - e.clientY;
    const newDragOffsets = [...mbtiColumnDragOffsets];
    newDragOffsets[columnIndex] = offset;
    setMbtiColumnDragOffsets(newDragOffsets);
  };
  
  const handleColumnMouseUp = (columnIndex) => {
    if (!mbtiColumnIsDragging[columnIndex] || mbtiColumnTouchStarts[columnIndex] === null) {
      const newIsDragging = [...mbtiColumnIsDragging];
      newIsDragging[columnIndex] = false;
      setMbtiColumnIsDragging(newIsDragging);
      return;
    }
    
    const distance = Math.abs(mbtiColumnDragOffsets[columnIndex]);
    const isUpSwipe = mbtiColumnDragOffsets[columnIndex] > 0;
    const isDownSwipe = mbtiColumnDragOffsets[columnIndex] < 0;
    
    // 拖拽滑动：如果距离超过阈值，切换选中状态
    if (distance > minDragDistance) {
      const newIndices = [...mbtiColumnIndices];
      if (isUpSwipe && newIndices[columnIndex] === 1) {
        newIndices[columnIndex] = 0; // 向上滑动，切换到第一行
      } else if (isDownSwipe && newIndices[columnIndex] === 0) {
        newIndices[columnIndex] = 1; // 向下滑动，切换到第二行
      }
      setMbtiColumnIndices(newIndices);
    }
    
    const newIsDragging = [...mbtiColumnIsDragging];
    newIsDragging[columnIndex] = false;
    setMbtiColumnIsDragging(newIsDragging);
    
    const newTouchStarts = [...mbtiColumnTouchStarts];
    newTouchStarts[columnIndex] = null;
    setMbtiColumnTouchStarts(newTouchStarts);
    
    const newDragOffsets = [...mbtiColumnDragOffsets];
    newDragOffsets[columnIndex] = 0;
    setMbtiColumnDragOffsets(newDragOffsets);
  };
  
  const handleColumnClick = (columnIndex) => {
    // 点选功能：直接切换选中状态
    const newIndices = [...mbtiColumnIndices];
    newIndices[columnIndex] = newIndices[columnIndex] === 0 ? 1 : 0;
    setMbtiColumnIndices(newIndices);
  };

  const onMbtiTouchStart = (e) => {
    setMbtiTouchStart(e.targetTouches[0].clientX);
    setMbtiDragOffset(0);
  };

  const onMbtiTouchMove = (e) => {
    if (mbtiTouchStart !== null) {
      const currentX = e.targetTouches[0].clientX;
      const offset = mbtiTouchStart - currentX;
      setMbtiDragOffset(offset);
    }
  };

  const onMbtiTouchEnd = () => {
    if (mbtiTouchStart === null) return;
    const distance = Math.abs(mbtiDragOffset);
    const isLeftSwipe = mbtiDragOffset > 0;
    const isRightSwipe = mbtiDragOffset < 0;

    if (distance > minSwipeDistance) {
      // 根据滑动距离计算应该切换多少个项目，每80px切换一个
      const itemWidth = 120; // 每个项目之间的间距
      const steps = Math.round(distance / itemWidth);
      
      if (isLeftSwipe) {
        const newIndex = Math.min(mbtiIndex + steps, mbtiTypes.length - 1);
        setMbtiIndex(newIndex);
      } else if (isRightSwipe) {
        const newIndex = Math.max(mbtiIndex - steps, 0);
        setMbtiIndex(newIndex);
      }
    }
    setMbtiTouchStart(null);
    setMbtiDragOffset(0);
  };

  const onMbtiMouseDown = (e) => {
    setMbtiIsDragging(true);
    setMbtiMouseStart(e.clientX);
    setMbtiDragOffset(0);
  };

  const onMbtiMouseMove = (e) => {
    if (!mbtiIsDragging || mbtiMouseStart === null) return;
    const offset = mbtiMouseStart - e.clientX;
    setMbtiDragOffset(offset);
  };

  const onMbtiMouseUp = () => {
    if (!mbtiIsDragging || mbtiMouseStart === null) {
      setMbtiIsDragging(false);
      setMbtiDragOffset(0);
      return;
    }
    const distance = Math.abs(mbtiDragOffset);
    const isLeftSwipe = mbtiDragOffset > 0;
    const isRightSwipe = mbtiDragOffset < 0;

    if (distance > minSwipeDistance) {
      // 根据滑动距离计算应该切换多少个项目，每80px切换一个
      const itemWidth = 120; // 每个项目之间的间距
      const steps = Math.round(distance / itemWidth);
      
      if (isLeftSwipe) {
        const newIndex = Math.min(mbtiIndex + steps, mbtiTypes.length - 1);
        setMbtiIndex(newIndex);
      } else if (isRightSwipe) {
        const newIndex = Math.max(mbtiIndex - steps, 0);
        setMbtiIndex(newIndex);
      }
    }
    setMbtiIsDragging(false);
    setMbtiMouseStart(null);
    setMbtiDragOffset(0);
  };

  const onMbtiMouseLeave = () => {
    setMbtiIsDragging(false);
    setMbtiMouseStart(null);
    setMbtiDragOffset(0);
  };

  // 鼠标滑动处理
  const onMouseDown = (e) => {
    setIsDragging(true);
    setMouseStart(e.clientX);
    setDragOffset(0);
  };

  const onMouseMove = (e) => {
    if (!isDragging || mouseStart === null) return;
    const offset = mouseStart - e.clientX;
    setDragOffset(offset);
  };

  const onMouseUp = () => {
    if (!isDragging || mouseStart === null) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    const distance = Math.abs(dragOffset);
    const isLeftSwipe = dragOffset > 0;
    const isRightSwipe = dragOffset < 0;

    if (distance > minSwipeDistance) {
      if (isLeftSwipe && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (isRightSwipe && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    setIsDragging(false);
    setMouseStart(null);
    setDragOffset(0);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    setMouseStart(null);
    setDragOffset(0);
  };

  // 启动页点击处理，跳转到第一个页面
  const handleSplashClick = () => {
    setIsExitingSplashPage(true);
    // 动画完成后切换到下一页
    setTimeout(() => {
      setShowSplashPage(false);
      setIsExitingSplashPage(false);
      // 延迟一小段时间后开始第一页背景淡入
      setTimeout(() => {
        setShowFirstPageBackground(true);
      }, 50);
    }, 600); // 动画持续时间600ms
  };

  const handleExploreClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowSecondPage(true);
      setIsTransitioning(false);
    }, 500); // 动画持续时间
  };

  const handleNextStepClick = () => {
    // 开始退出动画，同时淡出第二页背景
    setIsExitingSecondPage(true);
    setShowSecondPageBackground(false);
    // 动画完成后切换到第三页
    setTimeout(() => {
      setShowSecondPage(false);
      setShowThirdPage(true);
      setIsExitingSecondPage(false);
      // 重置第三页标题显示状态，以便触发动画
      setHasShownThirdPageTitle(false);
      // 延迟一小段时间后开始第三页背景淡入
      setTimeout(() => {
        setShowThirdPageBackground(true);
      }, 50);
    }, 600); // 动画持续时间600ms
  };

  // 第一页显示时，触发背景图片淡入
  useEffect(() => {
    if (!showSplashPage && !showSecondPage && !isExitingFirstPage) {
      // 第一页显示时，延迟一小段时间后开始背景图片淡入，确保页面已渲染
      const timer = setTimeout(() => {
        setShowFirstPageBackground(true);
      }, 50); // 延迟50ms后开始淡入，确保DOM已渲染
      
      return () => clearTimeout(timer);
    } else {
      // 离开第一页时重置状态
      setShowFirstPageBackground(false);
    }
  }, [showSplashPage, showSecondPage, isExitingFirstPage]);

  // 第一页自动切换到第二页（三段文本播放完成后，停留2秒，然后播放消散动画）
  useEffect(() => {
    if (!showSplashPage && !showSecondPage && !isExitingFirstPage) {
      // 三段文本播放完成后（最后一段2.3s完成），停留2秒，然后开始消散动画
      const timer = setTimeout(() => {
        setIsExitingFirstPage(true);
        // 同时淡出第一页背景
        setShowFirstPageBackground(false);
        // 消散动画完成后切换到第二页
        setTimeout(() => {
          setShowSecondPage(true);
          setIsExitingFirstPage(false);
          // 延迟一小段时间后开始背景图片淡入，确保页面已渲染
          setTimeout(() => {
            setShowSecondPageBackground(true);
          }, 50);
        }, 600); // 消散动画持续时间
      }, 4800); // 2.3s（最后一段完成）+ 2s停留 + 0.5s延迟
      
      return () => clearTimeout(timer);
    }
  }, [showSplashPage, showSecondPage, isExitingFirstPage]);

  // 星光页文本切换逻辑 - 循环播放
  // 文字停留2.6s + 动画0.65s = 总时长3.25s，加上出现动画0.65s = 总时长3.9s
  useEffect(() => {
    if (showStarPage && !isExitingStarPage && isEnteringLakeHeart) {
      // 重置文本索引
      setStarPageTextIndex(0);
      
      // 每3.9秒切换一次文本，循环播放（原2.5s * 1.3 = 3.25s，加上出现动画0.65s = 3.9s）
      const interval = setInterval(() => {
        setStarPageTextIndex(prev => {
          const nextIndex = (prev + 1) % starPageTexts.length;
          return nextIndex;
        });
      }, 3900);
      
      return () => clearInterval(interval);
    } else {
      // 离开星光页时重置索引，或者在内容加载完成时停止轮播
      if (!showStarPage) {
        setStarPageTextIndex(0);
      }
    }
  }, [showStarPage, isExitingStarPage, isEnteringLakeHeart]);

  // 第三页显示时，触发标题动画
  useEffect(() => {
    if (showThirdPage && !hasShownThirdPageTitle && conversationHistory.length === 0) {
      // 延迟一小段时间后触发标题动画，确保页面已渲染
      const timer = setTimeout(() => {
        setHasShownThirdPageTitle(true);
      }, 100); // 延迟100ms后开始动画，确保DOM已渲染
      
      return () => clearTimeout(timer);
    }
  }, [showThirdPage, hasShownThirdPageTitle, conversationHistory.length]);


  // 处理键盘icon点击，显示输入框
  const handleKeyboardIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 保存当前滚动位置
    const scrollY = window.scrollY;
    setShowInputBox(true);
    // 延迟聚焦以确保输入框已渲染
    setTimeout(() => {
      // 恢复滚动位置，防止页面跳动
      window.scrollTo(0, scrollY);
      inputRef.current?.focus({
        preventScroll: true
      });
    }, 100);
  };

  // 处理输入框提交
  const handleInputSubmit = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    
    // 隐藏输入框并清空输入
    setShowInputBox(false);
    setInputValue('');
    
    // 检测是否输入了"进入湖心"或"进入心湖"
    if (text.includes('进入湖心') || text.includes('进入心湖')) {
      setIsProcessing(true);
      setFinalTranscript(text);
      setBotReply('');
      // 调用进入湖心函数（函数内部会切换到星光页面）
      await handleEnterLakeHeart();
      setIsProcessing(false);
      return;
    }
    
    // 设置用户输入文本
    setFinalTranscript(text);
    setBotReply('');
    setIsProcessing(true);
    
    // 调用 API 获取回复
    await fetchBotReply(text);
  };

  // 处理输入框取消（点击外部或ESC键）
  const handleInputCancel = () => {
    // 保存当前滚动位置
    const scrollY = window.scrollY;
    setShowInputBox(false);
    setInputValue('');
    // 恢复滚动位置，防止页面跳动
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  // 解析湖心内容为四段结构（按照1: 2: 3: 4: 格式）
  const parseLakeHeartContent = (content) => {
    if (!content) {
      return {
        m1: '',
        m2: '',
        m3: '',
        m4: ''
      };
    }

    let text = String(content).trim();
    
    // 检查并去除重复内容
    // 如果整个文本块重复了（前后两半相同），只保留前半部分
    const textLength = text.length;
    if (textLength > 20) {
      const midPoint = Math.floor(textLength / 2);
      const firstHalf = text.substring(0, midPoint).trim();
      const secondHalf = text.substring(midPoint).trim();
      
      // 比较前半部分和后半部分的前100个字符，如果相似度高，认为是重复
      if (firstHalf.length > 50 && secondHalf.length > 50) {
        const firstSample = firstHalf.substring(0, Math.min(100, firstHalf.length));
        const secondSample = secondHalf.substring(0, Math.min(100, secondHalf.length));
        
        // 如果前100个字符完全相同，或者是完全相同的文本块，只保留前半部分
        if (firstSample === secondSample || firstHalf === secondHalf) {
          text = firstHalf.trim();
        }
      }
    }
    
    let sections = {
      m1: '',
      m2: '',
      m3: '',
      m4: ''
    };

    // 使用正则表达式查找 1:、2:、3:、4: 标记的位置
    // 支持 1:、1：、1.、M1、M1: 等格式
    const findMarker = (text, marker) => {
      // 尝试多种格式
      const patterns = [
        `^${marker}:`,      // 行首的 1:
        `^${marker}：`,     // 行首的 1：
        `\\b${marker}:`,    // 单词边界的 1:
        `\\b${marker}：`,   // 单词边界的 1：
        `${marker}.`,       // 1.
        `${marker} `,       // 1 后面跟空格
        `M${marker}:`,      // M1:
        `M${marker}：`,     // M1：
        `M${marker} `,      // M1 后面跟空格
        marker              // 1 或 M1
      ];
      
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'm'); // 多行模式
        const match = text.match(regex);
        if (match) {
          const index = text.indexOf(match[0]);
          // 返回标记结束的位置（跳过标记和可能的冒号、空格）
          let endIndex = index + match[0].length;
          // 跳过可能的空格
          while (endIndex < text.length && text[endIndex] === ' ') {
            endIndex++;
          }
          return endIndex;
        }
      }
      return -1;
    };

    const m1Pos = findMarker(text, '1');
    const m2Pos = findMarker(text, '2');
    const m3Pos = findMarker(text, '3');
    const m4Pos = findMarker(text, '4');
    
    // 去除数字标记的函数（移除所有位置的标记）
    const removeMarker = (str) => {
      if (!str) return str;
      let cleaned = str.trim();
      
      // 移除开头的 1:、1：、1.、M1:、M1： 等标记及其后面的空格
      cleaned = cleaned.replace(/^(M?[1-4][:：\.]\s*)/, '');
      
      // 移除文本中所有位置的数字标记（如 "2:"、"3:"、"4:" 等）
      // 匹配模式：空格 + 数字（1-4）+ 冒号/中文冒号/点号 + 可选空格
      // 但要避免误删正常数字（如"2个"、"3件"），所以只匹配后面跟空格或结尾的情况
      cleaned = cleaned.replace(/\s+(M?[1-4][:：\.])(\s+|$)/g, ' ');
      
      // 移除末尾的数字标记（如 "2:"、"3:"、"4:" 等）
      cleaned = cleaned.replace(/\s+(M?[1-4][:：\.])\s*$/, '');
      
      // 移除单独的数字标记（前后都有空格的情况）
      cleaned = cleaned.replace(/\s+([1-4])[:：\.]\s+/g, ' ');
      
      // 清理多余的空格和换行
      cleaned = cleaned.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
      
      return cleaned;
    };
    
    // 检查文本合理性的函数
    const cleanSection = (section) => {
      if (!section) return '';
      // 先去除数字标记
      let cleaned = removeMarker(section.trim());
      
      // 移除末尾可能残留的数字和标点（如 "2"、"3"、"4" 等单独的数字）
      cleaned = cleaned.replace(/\s*[1-4]\s*[:：\.]?\s*$/, '').trim();
      
      // 移除段落中间可能出现的数字标记模式（如 "文本 2:"、"文本 3:" 等）
      // 匹配：中文字符或标点 + 空格 + 数字 + 冒号
      cleaned = cleaned.replace(/([\u4e00-\u9fff，。！？、])\s+([1-4])[:：\.]\s*/g, '$1 ');
      
      // 再次清理多余空格
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      
      // 如果内容太短（少于3个字符），可能是解析错误，返回空
      if (cleaned.length < 3) return '';
      // 如果内容只包含标点或空格，没有实际文字内容，返回空
      if (!/[a-zA-Z\u4e00-\u9fff]/.test(cleaned)) return '';
      return cleaned;
    };
    
    // 提取第一部分
    if (m1Pos >= 0) {
      const endPos = m2Pos >= 0 ? m2Pos : (m3Pos >= 0 ? m3Pos : (m4Pos >= 0 ? m4Pos : text.length));
      sections.m1 = cleanSection(text.substring(m1Pos, endPos));
    }
    
    // 提取第二部分
    if (m2Pos >= 0) {
      const endPos = m3Pos >= 0 ? m3Pos : (m4Pos >= 0 ? m4Pos : text.length);
      sections.m2 = cleanSection(text.substring(m2Pos, endPos));
    }
    
    // 提取第三部分
    if (m3Pos >= 0) {
      const endPos = m4Pos >= 0 ? m4Pos : text.length;
      sections.m3 = cleanSection(text.substring(m3Pos, endPos));
    }
    
    // 提取第四部分
    if (m4Pos >= 0) {
      sections.m4 = cleanSection(text.substring(m4Pos));
    }

    return sections;
  };

  // 处理进入湖心的公共函数
  const handleEnterLakeHeart = async () => {
    console.log('用户选择了"进入湖心"，发送给Coze: 进入湖心');
    
    // 触发对话页内容向上消失和模糊效果，同时淡出第三页背景
    setIsExitingThirdPage(true);
    setShowThirdPageBackground(false);
    
    // 动画完成后切换到星光页面
    setTimeout(() => {
      setShowThirdPage(false);
      setShowStarPage(true);
      setIsExitingThirdPage(false);
      setIsEnteringLakeHeart(true);
      // 延迟一小段时间后开始星光页背景淡入
      setTimeout(() => {
        setShowStarPageBackground(true);
      }, 50);
    }, 1200); // 动画持续时间1200ms
    
    try {
      // 向 Coze 发送"进入湖心"
      const { reply } = await chatWithBot('进入湖心');
      console.log('========== 湖心回复 ==========');
      console.log('收到湖心回复（原始）:', reply);
      console.log('回复类型:', typeof reply);
      console.log('回复长度:', reply ? reply.length : 0);
      console.log('完整回复内容:');
      console.log(JSON.stringify(reply, null, 2));
      
      // 保存原始返回内容
      setLakeHeartRawResponse(reply || '');
      
      // 尝试解析 JSON 格式
      let chineseContent = '';
      try {
        const jsonData = JSON.parse(reply);
        // 如果是 JSON，提取 content 或 text 字段
        if (jsonData.content) {
          chineseContent = String(jsonData.content).trim();
        } else if (jsonData.text) {
          chineseContent = String(jsonData.text).trim();
        } else if (jsonData.message) {
          chineseContent = String(jsonData.message).trim();
        } else if (jsonData.result) {
          chineseContent = String(jsonData.result).trim();
        } else {
          // 如果没有明确的文本字段，使用 extractChineseContent
          chineseContent = extractChineseContent(reply);
        }
      } catch (e) {
        // 不是 JSON 格式，使用 extractChineseContent
        chineseContent = extractChineseContent(reply);
      }
      
      console.log('提取后的中文内容:', chineseContent);
      console.log('============================');
      
      // 保存到状态
      setLakeHeartContent(chineseContent);
      // 解析为四段结构
      const parsedSections = parseLakeHeartContent(chineseContent);
      setLakeHeartSections(parsedSections);
      console.log('解析后的四段内容:', parsedSections);
      
      // API调用完成，触发星光页面退出动画，同时淡出星光页背景
      setIsEnteringLakeHeart(false);
      setIsExitingStarPage(true);
      setShowStarPageBackground(false);
      
      // 退出动画完成后切换到第四页
      setTimeout(() => {
        setShowStarPage(false);
        setShowFourthPage(true);
        setIsExitingStarPage(false);
        // 延迟一小段时间后开始湖心页背景淡入
        setTimeout(() => {
          setShowFourthPageBackground(true);
        }, 50);
      }, 1200); // 退出动画持续时间1200ms
    } catch (error) {
      console.error('获取湖心回复失败:', error);
      // 即使失败也触发退出动画，同时淡出星光页背景
      setIsEnteringLakeHeart(false);
      setIsExitingStarPage(true);
      setShowStarPageBackground(false);
      
      // 退出动画完成后切换到第四页
      setTimeout(() => {
        setShowStarPage(false);
        setShowFourthPage(true);
        setIsExitingStarPage(false);
        // 延迟一小段时间后开始湖心页背景淡入
        setTimeout(() => {
          setShowFourthPageBackground(true);
        }, 50);
      }, 1200);
    }
  };

  // 提取中文内容（只保留中文字符、中文标点、数字、空格和换行）
  const extractChineseContent = (text) => {
    if (!text) return '';
    
    // 如果文本已经是纯中文内容（不包含JSON结构），直接返回
    if (typeof text !== 'string') {
      text = String(text);
    }
    
    // 先移除JSON格式的内容（大括号、引号等）
    let cleaned = text
      .replace(/\{[^{}]*\}/g, '') // 移除JSON对象（支持嵌套）
      .replace(/\[[^\[\]]*\]/g, '') // 移除JSON数组
      .replace(/"[^"]*"/g, '') // 移除双引号内容
      .replace(/'[^']*'/g, '') // 移除单引号内容
      .replace(/msg_type|generate_answer|finish_reason|FinData|from_module|from_unit|node_type|event|id|data/gi, '') // 移除JSON关键字
      .replace(/[{}[\]"]+/g, '') // 移除剩余的JSON符号
      .replace(/[""]{2,}/g, '') // 移除连续的引号
      .replace(/[，,。、\s]*$/g, ''); // 移除末尾的标点和空格
    
    // 使用正则表达式匹配中文字符、中文标点、数字、空格、换行和常见标点
    // 中文字符：\u4e00-\u9fff
    // 中文标点：\u3000-\u303f, \uff00-\uffef
    // 保留：数字0-9、空格、换行、常见标点符号、英文括号等
    const chinesePattern = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef0-9\s，。！？；：、""''（）【】()\n\r]/g;
    const matches = cleaned.match(chinesePattern);
    let result = matches ? matches.join('') : '';
    
    // 如果提取后为空，尝试保留更多字符（包括一些英文单词，如果它们出现在中文文本中）
    if (!result || result.trim().length < cleaned.trim().length * 0.3) {
      // 如果提取的内容太少，使用更宽松的模式
      const relaxedPattern = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef0-9a-zA-Z\s，。！？；：、""''（）【】()\n\r\-_]/g;
      const relaxedMatches = cleaned.match(relaxedPattern);
      result = relaxedMatches ? relaxedMatches.join('') : cleaned;
    }
    
    // 清理连续的标点符号、引号和空格，但保留文本结构
    result = result
      .replace(/[""]{2,}/g, '') // 移除连续的引号
      .replace(/[，,。、\s]{3,}/g, ' ') // 将3个以上的连续标点和空格替换为单个空格
      .replace(/\s{2,}/g, ' ') // 将多个空格替换为单个空格
      .trim();
    
    return result;
  };

  // 解析回复内容，提取问题和选项
  // 彻底重写的解析函数 - 简单、可靠、直接
  const parseReplyContent = (reply) => {
    // 重置提取结果
    setExtractedQuestion('');
    setExtractedOptions([]);
    setSelectedOptions(new Set());
    
    if (!reply) return { question: '', options: [] };
    
    console.log('========== 开始解析Coze返回 ==========');
    console.log('原始返回内容:', reply);
    console.log('返回内容长度:', reply.length);
    
    const text = String(reply).trim();
    
    // 第一步：尝试JSON解析（最可靠）
    try {
      let jsonData = null;
      try {
        jsonData = JSON.parse(text);
      } catch (e1) {
        // JSON解析失败，尝试从文本中提取JSON
        const jsonMatch = text.match(/\{[\s\S]*"question"[\s\S]*"options"[\s\S]*\}/);
        if (jsonMatch) {
          try {
            jsonData = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            const anyJsonMatch = text.match(/\{[\s\S]*\}/);
            if (anyJsonMatch) {
              try {
                jsonData = JSON.parse(anyJsonMatch[0]);
              } catch (e3) {}
            }
          }
        }
      }
      
      if (jsonData) {
        const question = jsonData.question || jsonData.content || jsonData.text || '';
        const options = jsonData.options || jsonData.choices || [];
        
        if (question && Array.isArray(options) && (options.length === 3 || options.length >= 4)) {
          const cleanQuestion = String(question).trim();
          const optionCount = options.length >= 4 ? 4 : 3;
          const cleanOptions = options.slice(0, optionCount)
            .map(opt => String(opt).trim())
            .filter(opt => opt && /[\u4e00-\u9fff]/.test(opt));
          
          if (cleanQuestion && (cleanOptions.length === 3 || cleanOptions.length === 4)) {
            setExtractedQuestion(cleanQuestion);
            setExtractedOptions(cleanOptions);
            console.log('✅ JSON解析成功:', { question: cleanQuestion, options: cleanOptions });
            return { question: cleanQuestion, options: cleanOptions };
          }
        }
      }
    } catch (e) {
      console.log('JSON解析失败，使用文本解析');
    }
    
    // 第二步：文本解析 - 简单直接的方法
    // 方法1：直接匹配 "1. xxx 2. xxx 3. xxx 4. xxx" 格式
    const optionPattern = /(\d+)[\.、．]\s*([^\d]+?)(?=\s*\d+[\.、．]|$)/g;
    const optionMatches = [];
    let match;
    
    while ((match = optionPattern.exec(text)) !== null) {
      const num = parseInt(match[1]);
      const content = match[2].trim();
      if (num >= 1 && num <= 4 && content && /[\u4e00-\u9fff]/.test(content)) {
        optionMatches.push({ num, content, index: match.index });
      }
    }
    
    // 如果找到了1-3或1-4的选项
    if (optionMatches.length >= 3) {
      const optionsMap = new Map();
      optionMatches.forEach(m => {
        if (m.num >= 1 && m.num <= 4 && !optionsMap.has(m.num)) {
          optionsMap.set(m.num, m.content);
        }
      });
      
      if (optionsMap.size === 3 || optionsMap.size === 4) {
        // 提取问题：从开头到第一个选项之前
        const firstOptionIndex = optionMatches[0].index;
        let question = text.substring(0, firstOptionIndex).trim();
        
        // 确保问题以问号结尾
        if (!/[？?。！!]$/.test(question)) {
          question = question.replace(/[。！!]$/, '') + '?';
        }
        
        const options = [];
        if (optionsMap.has(1)) options.push(optionsMap.get(1));
        if (optionsMap.has(2)) options.push(optionsMap.get(2));
        if (optionsMap.has(3)) options.push(optionsMap.get(3));
        if (optionsMap.has(4)) options.push(optionsMap.get(4));
        
        const validOptions = options.filter(opt => opt && opt.trim().length > 0);
        
        if (question && (validOptions.length === 3 || validOptions.length === 4)) {
          setExtractedQuestion(question);
          setExtractedOptions(validOptions);
          console.log('✅ 简单模式匹配成功:', { question, options: validOptions });
          return { question, options: validOptions };
        }
      }
    }
    
    // 方法2：使用完整正则匹配 "问题？1. xxx 2. xxx 3. xxx 4. xxx"
    const fullPattern = /(.+?[？?。！!])\s*(?:1[\.、．]\s*([^\d]+?)\s+2[\.、．]\s*([^\d]+?)\s+3[\.、．]\s*([^\d]+?)\s+4[\.、．]\s*([^\d]+?)(?:\s*\d|$))/s;
    const fullMatch = text.match(fullPattern);
    
    if (fullMatch) {
      const question = fullMatch[1].trim();
      const options = [
        fullMatch[2] ? fullMatch[2].trim() : '',
        fullMatch[3] ? fullMatch[3].trim() : '',
        fullMatch[4] ? fullMatch[4].trim() : '',
        fullMatch[5] ? fullMatch[5].trim() : ''
      ].filter(opt => opt && /[\u4e00-\u9fff]/.test(opt));
      
      if (question && (options.length === 3 || options.length === 4)) {
        setExtractedQuestion(question);
        setExtractedOptions(options);
        console.log('✅ 完整模式匹配成功:', { question, options });
        return { question, options };
      }
    }
    
    // 方法3：逐行解析
    const lines = text.split(/\n/).map(line => line.trim()).filter(line => line.length > 0);
    let foundQuestion = '';
    const foundOptions = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 查找问题
      if (!foundQuestion && /[？?。！!]/.test(line) && line.length > 5) {
        foundQuestion = line;
        continue;
      }
      
      // 查找选项
      const optionMatch = line.match(/^(\d+)[\.、．\s]+(.+)$/);
      if (optionMatch) {
        const num = parseInt(optionMatch[1]);
        const content = optionMatch[2].trim();
        if (num >= 1 && num <= 4 && content && /[\u4e00-\u9fff]/.test(content)) {
          foundOptions[num - 1] = content;
        }
      }
    }
    
    const validFoundOptions = foundOptions.filter(opt => opt);
    if (foundQuestion && (validFoundOptions.length === 3 || validFoundOptions.length === 4) && validFoundOptions.every(opt => opt)) {
      setExtractedQuestion(foundQuestion);
      setExtractedOptions(validFoundOptions);
      console.log('✅ 逐行解析成功:', { question: foundQuestion, options: validFoundOptions });
      return { question: foundQuestion, options: validFoundOptions };
    }
    
    console.warn('❌ 所有解析方法都失败');
    console.warn('文本内容:', text.substring(0, 500));
    return { question: '', options: [] };
  };

  // 调用 Coze API 获取机器人回复（使用工具函数，v2 API不需要创建会话）
  const fetchBotReply = async (userMessage) => {
    try {
      // 检测是否包含"进入湖心"或"进入心湖"
      if (userMessage.includes('进入湖心') || userMessage.includes('进入心湖')) {
        // 调用进入湖心函数（函数内部会切换到星光页面）
        await handleEnterLakeHeart();
        return;
      }
      
      // 添加用户消息到历史记录
      const userMessageItem = {
        type: 'user',
        content: userMessage,
        timestamp: Date.now(),
        messageId: `user-${Date.now()}-${Math.random()}`, // 为每个消息创建唯一ID
      };
      setConversationHistory(prev => [...prev, userMessageItem]);
      
      setIsFetchingReply(true);
      setBotReply('');
      setExtractedQuestion('');
      setExtractedOptions([]);
      setSelectedOptions(new Set()); // 重置选中状态
      
      console.log('=== 开始调用 Coze API (v2) ===');
      console.log('用户消息:', userMessage);
      
      // 使用 v2 API，直接发送消息（不需要创建会话）
      const { reply } = await chatWithBot(userMessage);
      console.log('========== Coze API 返回内容 ==========');
      console.log('收到回复（原始）:', reply);
      console.log('回复类型:', typeof reply);
      console.log('回复长度:', reply ? reply.length : 0);
      console.log('完整回复内容（前1000字符）:', reply ? reply.substring(0, 1000) : '');
      console.log('完整回复内容（全部）:');
      console.log(JSON.stringify(reply, null, 2));
      console.log('========================================');
      
      // 保存原始返回内容到状态，用于在页面显示（保存完整原始内容，不做任何处理）
      setRawCozeResponse(reply || '');
      
      // 解析回复内容，提取问题和选项（使用原始回复）
      const parsedResult = parseReplyContent(reply);
      
      console.log('========== 解析结果 ==========');
      console.log('解析后的问题:', parsedResult.question);
      console.log('解析后的选项数量:', parsedResult.options?.length || 0);
      console.log('解析后的选项:', parsedResult.options);
      console.log('==============================');
      
      // 死规则：严格检查格式
      // 必须是一行正文（问题）+ 三个或四个选项
      const hasValidFormat = parsedResult.question && 
                             parsedResult.question.trim().length > 0 &&
                             parsedResult.options && 
                             (parsedResult.options.length === 3 || parsedResult.options.length === 4) &&
                             parsedResult.options.every(opt => opt && opt.trim().length > 0 && /[\u4e00-\u9fff]/.test(opt));
      
      if (!hasValidFormat) {
        console.warn('❌ 格式不符合要求：必须是一行正文 + 三个或四个选项');
        console.warn('问题:', parsedResult.question);
        console.warn('选项数量:', parsedResult.options?.length || 0);
        console.warn('选项:', parsedResult.options);
        console.warn('原始回复内容:', reply);
        
        // 如果格式不符合，尝试重新解析或显示原始内容
        // 先尝试更宽松的解析
        const retryResult = parseReplyContent(reply);
        if (retryResult.question && retryResult.options && (retryResult.options.length === 3 || retryResult.options.length === 4)) {
          console.log('✅ 重试解析成功');
          // 使用重试结果
          const botMessageItem = {
            type: 'bot',
            content: '',
            extractedQuestion: retryResult.question.trim(),
            extractedOptions: retryResult.options.map(opt => opt.trim()),
            timestamp: Date.now(),
            messageId: `bot-${Date.now()}-${Math.random()}`,
          };
          setConversationHistory(prev => [...prev, botMessageItem]);
          setBotReply('');
          setIsProcessing(false);
          setIsFetchingReply(false);
          return;
        }
        
        // 如果重试也失败，显示错误提示（而不是完全不显示）
        const errorMessageItem = {
          type: 'bot',
          content: '抱歉，返回的内容格式不符合要求，无法解析出问题和选项。请检查 Coze 返回格式。',
          extractedQuestion: '',
          extractedOptions: [],
          timestamp: Date.now(),
          messageId: `bot-error-${Date.now()}-${Math.random()}`,
        };
        setConversationHistory(prev => [...prev, errorMessageItem]);
        setBotReply(errorMessageItem.content);
        setIsProcessing(false);
        setIsFetchingReply(false);
        console.error('❌ Coze 返回格式不符合要求，已显示错误提示');
        return;
      }
      
      // 计算当前用户消息数量（用户消息已经在上面添加到历史记录中了）
      const currentUserMessageCount = conversationHistory.filter(msg => msg.type === 'user').length;
      
      // 如果用户对话达到第6轮（currentUserMessageCount >= 6），且解析到了3个或4个选项，则添加第五个选项"进入湖心，看看结果"
      // 注意：只有在格式正确（3个或4个选项）的情况下才添加第五个选项
      // 从第6轮开始，后续所有轮次都会显示这个选项
      let finalOptions = parsedResult.options.map(opt => opt.trim());
      if (currentUserMessageCount >= 6 && (finalOptions.length === 3 || finalOptions.length === 4)) {
        // 检查是否已经包含"进入湖心"选项，避免重复添加
        const hasLakeHeartOption = finalOptions.some(opt => opt.includes('进入湖心') || opt.includes('进入心湖'));
        if (!hasLakeHeartOption) {
          finalOptions.push('进入湖心，看看结果');
          console.log(`第${currentUserMessageCount}轮对话：添加第五个选项"进入湖心，看看结果"`, finalOptions);
        }
      }
      
      // 如果成功提取了选项，content 设为空（问题和选项会通过 extractedQuestion 和 extractedOptions 单独显示）
      // 死规则：有选项时，content 必须为空字符串
      const botMessageItem = {
        type: 'bot',
        content: '', // 有选项时强制为空，不显示任何 content
        extractedQuestion: parsedResult.question.trim(), // 确保是字符串且已清理
        extractedOptions: finalOptions, // 使用最终选项（可能包含第五个选项）
        timestamp: Date.now(),
        messageId: `bot-${Date.now()}-${Math.random()}`, // 为每个消息创建唯一ID
      };
      
      console.log('✅ 保存到历史记录（格式正确）:', {
        hasOptions: true,
        question: `"${botMessageItem.extractedQuestion}"`,
        questionLength: botMessageItem.extractedQuestion.length,
        options: botMessageItem.extractedOptions,
        optionsCount: botMessageItem.extractedOptions.length,
      });
      
      setConversationHistory(prev => [...prev, botMessageItem]);
      
      // 有选项时，botReply 设为空（问题和选项会单独显示）
      setBotReply('');
      
      setIsProcessing(false);
      console.log('=== Coze API 调用完成 ===');
      
      // 注意：不再自动跳转到湖心页面
      // 用户必须通过点击"进入湖心，看看结果"选项来进入湖心页面
    } catch (error) {
      console.error('=== 获取机器人回复失败 ===');
      console.error('错误类型:', error.name);
      console.error('错误消息:', error.message);
      if (error.stack) {
        console.error('错误堆栈:', error.stack);
      }
      setIsProcessing(false);
      const errorMsg = error.message || '获取回复时出现错误，请稍后重试';
      
      // 添加错误消息到历史记录（错误消息也提取中文）
      const errorMessageItem = {
        type: 'bot',
        content: extractChineseContent(`错误: ${errorMsg}`) || '获取回复时出现错误，请稍后重试',
        extractedQuestion: '',
        extractedOptions: [],
        timestamp: Date.now(),
        messageId: `bot-error-${Date.now()}-${Math.random()}`, // 为每个消息创建唯一ID
      };
      setConversationHistory(prev => [...prev, errorMessageItem]);
      
      setBotReply(errorMessageItem.content);
      setExtractedQuestion('');
      setExtractedOptions([]);
      setSelectedOptions(new Set()); // 重置选中状态
    } finally {
      setIsFetchingReply(false);
    }
  };

  // 初始化语音识别
  useEffect(() => {
    if (showThirdPage) {
      // 检查浏览器支持
      const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      console.log('浏览器支持语音识别:', isSupported);
      
      if (isSupported) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'zh-CN';
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;

        recognitionInstance.onstart = () => {
          console.log('语音识别已启动，麦克风已激活');
          setIsListening(true);
        };

        recognitionInstance.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscriptText = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptText += transcript;
              accumulatedTranscriptRef.current += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscriptText || interimTranscript);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
          // 如果有识别到的文本，显示处理动画并获取回复
          const textToShow = accumulatedTranscriptRef.current.trim();
          if (textToShow) {
            setIsProcessing(true);
            setFinalTranscript(textToShow);
            setTranscript(''); // 清空临时文本
            accumulatedTranscriptRef.current = ''; // 清空累积文本
            
            // 调用 Coze API 获取回复
            fetchBotReply(textToShow);
          }
        };

        recognitionInstance.onerror = (event) => {
          console.error('语音识别错误:', event.error);
          console.error('错误代码:', event.error);
          
          // 根据错误类型给出提示
          let errorMessage = '语音识别出错';
          switch(event.error) {
            case 'no-speech':
              errorMessage = '未检测到语音，请重新尝试';
              break;
            case 'audio-capture':
              errorMessage = '无法访问麦克风，请检查权限设置';
              break;
            case 'not-allowed':
              errorMessage = '麦克风权限被拒绝，请在浏览器设置中允许麦克风访问';
              break;
            case 'network':
              errorMessage = '网络错误，请检查网络连接';
              break;
            case 'aborted':
              // 用户主动停止，不需要提示
              break;
            default:
              errorMessage = `语音识别错误: ${event.error}`;
          }
          
          if (event.error !== 'aborted') {
            console.error('错误信息:', errorMessage);
          }
          
          setIsListening(false);
          setIsProcessing(false);
          setIsHoldingGradient(false);
        };

        recognitionRef.current = recognitionInstance;
        console.log('语音识别已初始化完成');
      } else {
        console.warn('浏览器不支持语音识别API');
        recognitionRef.current = null;
      }

      return () => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // 忽略停止时的错误
          }
          recognitionRef.current = null;
        }
      };
    } else {
      recognitionRef.current = null;
    }
  }, [showThirdPage]);

  // 更新触摸位置（使用 requestAnimationFrame 优化性能）
  const updateTouchPosition = (clientX, clientY) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      const containerRect = thirdPageContainerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const x = clientX - containerRect.left;
        const y = clientY - containerRect.top;
        // 确保位置在容器范围内
        if (x >= 0 && x <= containerRect.width && y >= 0 && y <= containerRect.height) {
          setTouchPosition({ x, y });
        }
      }
    });
  };

  // 渐变区域的触摸开始处理
  const handleGradientTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
    
    // 阻止文本选择
    if (e.type === 'mousedown') {
      e.target.style.userSelect = 'none';
      e.target.style.webkitUserSelect = 'none';
    }
    
    setIsHoldingGradient(true);
    setIsListening(true);
    accumulatedTranscriptRef.current = ''; // 重置累积文本
    setFinalTranscript(''); // 清空之前的结果
    setBotReply(''); // 清空之前的回复
    setIsProcessing(false); // 重置处理状态
    setIsFetchingReply(false); // 重置获取回复状态
    const touch = e.touches ? e.touches[0] : e;
    
    // 直接更新位置，不进行边界检查
    const containerRect = thirdPageContainerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setTouchPosition({
        x: touch.clientX - containerRect.left,
        y: touch.clientY - containerRect.top,
      });
    }

    // 开始语音识别
    if (recognitionRef.current) {
      try {
        console.log('尝试启动语音识别...');
        recognitionRef.current.start();
        console.log('语音识别启动命令已发送');
      } catch (error) {
        console.error('启动语音识别失败:', error);
        console.error('错误详情:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        setIsListening(false);
        setIsHoldingGradient(false);
        
        // 只在非开发环境显示提示
        if (import.meta.env.MODE !== 'development') {
          let errorMsg = '无法启动语音识别';
          if (error.name === 'NotAllowedError' || error.message?.includes('not allowed')) {
            errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许麦克风访问';
          } else if (error.name === 'NotFoundError' || error.message?.includes('not found')) {
            errorMsg = '未找到麦克风设备，请检查设备连接';
          } else if (error.message?.includes('network') || error.message?.includes('Network')) {
            errorMsg = '网络错误，请检查网络连接';
          } else {
            errorMsg = `语音识别错误: ${error.message || error.name}`;
          }
          alert(errorMsg);
        }
      }
    } else {
      console.warn('语音识别未初始化（可能是预览环境或不支持的浏览器）');
      // 在预览环境中，不显示alert，保持按住状态以便测试
      if (import.meta.env.MODE !== 'development') {
        const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        if (!isSupported) {
          console.warn('浏览器不支持语音识别功能');
        } else {
          console.warn('语音识别未初始化');
        }
      }
      // 保持按住状态，以便在松开时显示测试文本
      // 在预览环境中，设置测试文本
      accumulatedTranscriptRef.current = '这是预览模式的测试文字';
    }
  };

  // 渐变区域的触摸移动处理
  const handleGradientTouchMove = (e) => {
    // 对于触摸事件，需要检查状态
    if (e.touches && !isHoldingGradient) return;
    // 对于鼠标事件，不检查状态（由全局事件处理），但也要更新位置
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches ? e.touches[0] : e;
    // 直接更新位置，不进行边界检查，允许移出容器
    const containerRect = thirdPageContainerRef.current?.getBoundingClientRect();
    if (containerRect) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        setTouchPosition({
          x: touch.clientX - containerRect.left,
          y: touch.clientY - containerRect.top,
        });
      });
    }
  };

  // 渐变区域的触摸/鼠标结束处理
  const handleGradientTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHoldingGradient(false);
    setIsListening(false);
    setTouchPosition({ x: 0, y: 0 });
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // 停止语音识别（onend事件会处理后续逻辑）
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        // onend事件会处理文本显示
      } catch (error) {
        console.error('停止语音识别失败:', error);
        setIsListening(false);
        setIsProcessing(false);
        // 如果停止失败，也尝试显示已有文本
        const textToShow = accumulatedTranscriptRef.current.trim() || '这是预览模式的测试文字';
        if (textToShow) {
          setIsProcessing(true);
          setTimeout(() => {
            setFinalTranscript(textToShow);
            setIsProcessing(false);
            accumulatedTranscriptRef.current = '';
          }, 1500);
        }
      }
    } else {
      // 如果语音识别不可用（预览环境），模拟显示文本
      const simulatedText = accumulatedTranscriptRef.current.trim() || '这是预览模式的测试文字';
      console.log('预览模式：准备显示测试文本:', simulatedText);
      if (simulatedText) {
        setIsProcessing(true);
        setTimeout(() => {
          console.log('预览模式：显示文本:', simulatedText);
          setFinalTranscript(simulatedText);
          setIsProcessing(false);
          accumulatedTranscriptRef.current = '';
        }, 1500);
      }
    }
  };

  // 添加全局鼠标事件监听（用于鼠标拖拽）
  useEffect(() => {
    if (!isHoldingGradient) return;

    // 全局鼠标移动处理 - 确保即使鼠标移出渐变区域也能继续跟踪
    const handleGlobalMouseMove = (e) => {
      // 直接更新位置，不检查 isHoldingGradient（因为 useEffect 依赖已经确保只在按住时添加监听器）
      const containerRect = thirdPageContainerRef.current?.getBoundingClientRect();
      if (containerRect) {
        // 使用 requestAnimationFrame 优化性能，并允许移出容器范围
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          setTouchPosition({
            x: e.clientX - containerRect.left,
            y: e.clientY - containerRect.top,
          });
        });
      }
    };

    // 全局鼠标抬起处理 - 无论鼠标在哪里释放都能正确结束
    const handleGlobalMouseUp = (e) => {
      // 直接处理，不检查 isHoldingGradient（因为 useEffect 依赖已经确保只在按住时添加监听器）
      setIsHoldingGradient(false);
      setIsListening(false);
      setTouchPosition({ x: 0, y: 0 });
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // 停止语音识别
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('停止语音识别失败:', error);
        }
      } else {
        // 如果语音识别不可用（预览环境），模拟显示文本
        const simulatedText = accumulatedTranscriptRef.current.trim() || '这是预览模式的测试文字';
        console.log('预览模式（鼠标）：准备显示测试文本:', simulatedText);
        if (simulatedText) {
          setIsProcessing(true);
          setTimeout(() => {
            console.log('预览模式（鼠标）：显示文本:', simulatedText);
            setFinalTranscript(simulatedText);
            setIsProcessing(false);
            accumulatedTranscriptRef.current = '';
          }, 1500);
        }
      }
    };

    // 使用 capture 模式确保能捕获到所有鼠标事件
    window.addEventListener('mousemove', handleGlobalMouseMove, true);
    window.addEventListener('mouseup', handleGlobalMouseUp, true);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove, true);
      window.removeEventListener('mouseup', handleGlobalMouseUp, true);
    };
  }, [isHoldingGradient]);

  // 添加全局鼠标事件监听（用于新的MBTI字母选择器鼠标拖拽）
  useEffect(() => {
    const anyColumnDragging = mbtiColumnIsDragging.some(dragging => dragging);
    if (!anyColumnDragging) return;

    const handleGlobalColumnMouseMove = (e) => {
      mbtiColumnIsDragging.forEach((isDragging, columnIndex) => {
        if (isDragging && mbtiColumnTouchStarts[columnIndex] !== null) {
          const offset = mbtiColumnTouchStarts[columnIndex] - e.clientY;
          const newDragOffsets = [...mbtiColumnDragOffsets];
          newDragOffsets[columnIndex] = offset;
          setMbtiColumnDragOffsets(newDragOffsets);
        }
      });
    };

    const handleGlobalColumnMouseUp = () => {
      mbtiColumnIsDragging.forEach((isDragging, columnIndex) => {
        if (isDragging) {
          const distance = Math.abs(mbtiColumnDragOffsets[columnIndex]);
          const isUpSwipe = mbtiColumnDragOffsets[columnIndex] > 0;
          const isDownSwipe = mbtiColumnDragOffsets[columnIndex] < 0;

          if (distance > minDragDistance) {
            // 拖拽滑动
            const newIndices = [...mbtiColumnIndices];
            if (isUpSwipe && newIndices[columnIndex] === 1) {
              newIndices[columnIndex] = 0;
            } else if (isDownSwipe && newIndices[columnIndex] === 0) {
              newIndices[columnIndex] = 1;
            }
            setMbtiColumnIndices(newIndices);
          } else {
            // 点选：切换选中状态
            const newIndices = [...mbtiColumnIndices];
            newIndices[columnIndex] = newIndices[columnIndex] === 0 ? 1 : 0;
            setMbtiColumnIndices(newIndices);
          }

          const newIsDragging = [...mbtiColumnIsDragging];
          newIsDragging[columnIndex] = false;
          setMbtiColumnIsDragging(newIsDragging);

          const newTouchStarts = [...mbtiColumnTouchStarts];
          newTouchStarts[columnIndex] = null;
          setMbtiColumnTouchStarts(newTouchStarts);

          const newDragOffsets = [...mbtiColumnDragOffsets];
          newDragOffsets[columnIndex] = 0;
          setMbtiColumnDragOffsets(newDragOffsets);
        }
      });
    };

    window.addEventListener('mousemove', handleGlobalColumnMouseMove);
    window.addEventListener('mouseup', handleGlobalColumnMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalColumnMouseMove);
      window.removeEventListener('mouseup', handleGlobalColumnMouseUp);
    };
  }, [mbtiColumnIsDragging, mbtiColumnTouchStarts, mbtiColumnDragOffsets, mbtiColumnIndices]);

  // 添加全局鼠标事件监听（用于MBTI选择器鼠标拖拽）
  useEffect(() => {
    if (!mbtiIsDragging) return;

    // 全局鼠标移动处理
    const handleGlobalMbtiMouseMove = (e) => {
      if (mbtiMouseStart !== null) {
        const offset = mbtiMouseStart - e.clientX;
        setMbtiDragOffset(offset);
      }
    };

    // 全局鼠标抬起处理
    const handleGlobalMbtiMouseUp = () => {
      if (mbtiMouseStart === null) {
        setMbtiIsDragging(false);
        setMbtiDragOffset(0);
        return;
      }
      const distance = Math.abs(mbtiDragOffset);
      const isLeftSwipe = mbtiDragOffset > 0;
      const isRightSwipe = mbtiDragOffset < 0;

      if (distance > minSwipeDistance) {
        // 根据滑动距离计算应该切换多少个项目，每80px切换一个
        const itemWidth = 120; // 每个项目之间的间距
        const steps = Math.round(distance / itemWidth);
        
        if (isLeftSwipe) {
          const newIndex = Math.min(mbtiIndex + steps, mbtiTypes.length - 1);
          setMbtiIndex(newIndex);
        } else if (isRightSwipe) {
          const newIndex = Math.max(mbtiIndex - steps, 0);
          setMbtiIndex(newIndex);
        }
      }
      setMbtiIsDragging(false);
      setMbtiMouseStart(null);
      setMbtiDragOffset(0);
    };

    window.addEventListener('mousemove', handleGlobalMbtiMouseMove);
    window.addEventListener('mouseup', handleGlobalMbtiMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMbtiMouseMove);
      window.removeEventListener('mouseup', handleGlobalMbtiMouseUp);
    };
  }, [mbtiIsDragging, mbtiMouseStart, mbtiDragOffset, mbtiIndex]);

  // 滚动用户消息到顶部的函数
  const scrollUserMessageToTop = () => {
    if (!scrollContainerRef.current) {
      console.warn('滚动容器 ref 未绑定');
      return;
    }
    
    const container = scrollContainerRef.current;
    
    // 优先使用 ref，如果 ref 未绑定，则通过 DOM 查找最后一个用户消息
    let messageElement = lastUserMessageRef.current;
    
    if (!messageElement) {
      // 通过 DOM 查找所有用户消息，选择索引最大的（最新的）
      const userMessages = Array.from(container.querySelectorAll('[data-message-type="user"]'));
      if (userMessages.length > 0) {
        // 根据 data-message-index 找到索引最大的
        userMessages.sort((a, b) => {
          const indexA = parseInt(a.getAttribute('data-message-index') || '0');
          const indexB = parseInt(b.getAttribute('data-message-index') || '0');
          return indexB - indexA; // 降序，最大的在前
        });
        messageElement = userMessages[0];
      }
    }
    
    if (!messageElement) {
      console.warn('用户消息元素未找到，尝试延迟重试');
      // 如果还是找不到，延迟重试
      setTimeout(() => {
        scrollUserMessageToTop();
      }, 200);
      return;
    }
    
    // 使用 getBoundingClientRect 方法计算位置
    const containerRect = container.getBoundingClientRect();
    const messageRect = messageElement.getBoundingClientRect();
    
    // 计算消息相对于容器的位置
    const relativeTop = messageRect.top - containerRect.top + container.scrollTop;
    
    // 平滑滚动到消息位置（减去paddingTop: 70px）
    // 这样上轮对话会被推到上方不可见区域
    const targetScrollTop = relativeTop - 70;
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    
    console.log('✅ 滚动用户消息到顶部成功:', {
      messageIndex: messageElement.getAttribute('data-message-index'),
      messageTop: messageRect.top,
      containerTop: containerRect.top,
      currentScrollTop: container.scrollTop,
      relativeTop,
      finalScrollTop: relativeTop - 70
    });
  };

  // 滚动到用户最新消息或底部
  useEffect(() => {
    if (conversationHistory.length > 0) {
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      // 如果最后一条消息是用户消息，滚动到用户消息位置并置顶，隐藏上轮对话
      if (lastMessage.type === 'user') {
        // 使用更长的延迟确保 DOM 完全更新，ref 已绑定
        const timer = setTimeout(() => {
          scrollUserMessageToTop();
        }, 150);
        return () => clearTimeout(timer);
      } else if (messagesEndRef.current) {
        // 否则滚动到底部
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [conversationHistory]);

  // 已取消固定轮次机制，改为检测选项格式

  // 启动页 - 星星水波纹背景
  if (showSplashPage) {
    return (
      <div 
        className="relative bg-black overflow-hidden" 
        style={{ 
          width: '375px', 
          height: '812px', 
          margin: '0 auto', 
          cursor: 'pointer',
        }}
        onClick={handleSplashClick}
      >
        
        {/* 黑色背景层 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            zIndex: 0,
          }}
        />
        {/* 心湖标题 */}
        <div
          className="xinhu-reflection-container"
          style={{
            position: 'absolute',
            top: '298px',
            left: '50%',
            transform: isExitingSplashPage ? 'translateX(-50%) scale(1.5)' : 'translateX(-50%)',
            fontSize: '51px',
            fontFamily: '汉仪瑞意宋',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 1)',
            textAlign: 'center',
            zIndex: 3,
            pointerEvents: 'none',
            opacity: isExitingSplashPage ? 0 : 1,
            filter: isExitingSplashPage ? 'blur(20px)' : 'blur(0)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          心湖
        </div>
        {/* 星星水波纹动图背景 - 上半部分（绿色调） */}
        <div
          style={{
            position: 'absolute',
            top: '526px',
            left: '-13px',
            width: '100%',
            height: '50%',
            backgroundImage: `url(${splashBackgroundImage})`,
            backgroundSize: isExitingSplashPage ? '225%' : '150%', // 退出时放大
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            animation: isExitingSplashPage ? 'none' : 'splashOpacity 3s ease-in-out infinite',
            filter: isExitingSplashPage ? 'hue-rotate(120deg) saturate(1.3) blur(20px)' : 'hue-rotate(120deg) saturate(1.3)',
            opacity: isExitingSplashPage ? 0 : 1,
            zIndex: 1,
            overflow: 'hidden',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {/* 星星水波纹动图背景 - 复制图层（蓝绿混合色调） */}
        <div
          style={{
            position: 'absolute',
            top: '443px',
            left: '-166px',
            width: '842px',
            height: '914px',
            backgroundImage: `url(${splashBackgroundImage})`,
            backgroundSize: isExitingSplashPage ? '225%' : '150%', // 退出时放大
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            animation: isExitingSplashPage ? 'none' : 'splashOpacity 3s ease-in-out infinite',
            filter: isExitingSplashPage ? 'blur(20px)' : 'blur(0px)',
            mixBlendMode: 'screen', // 混合模式，创造蓝绿混合效果
            opacity: isExitingSplashPage ? 0 : 1,
            zIndex: 2,
            overflow: 'hidden',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {/* 点击提示文字 */}
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: isExitingSplashPage ? 'translateX(-50%) scale(1.5)' : 'translateX(-50%)',
            fontSize: '16px',
            fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 400,
            textAlign: 'center',
            zIndex: 1,
            pointerEvents: 'none',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.3) 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            animation: isExitingSplashPage ? 'none' : 'slowSweep 8s ease-in-out infinite',
            opacity: isExitingSplashPage ? 0 : 1,
            filter: isExitingSplashPage ? 'blur(20px)' : 'blur(0)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          探寻湖心
        </div>
      </div>
    );
  }

  // 星光页面 - 显示星光gif和结算底色图片
  if (showStarPage) {
    return (
      <div className="relative bg-black overflow-hidden" style={{ width: '375px', height: '812px', margin: '0 auto' }}>
        {/* 背景图片层 - 最底层 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: showStarPageBackground ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 0,
          }}
        />
        
        {/* 星光gif动画层 */}
        <img
          src={starLightImage}
          alt="星光"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'saturate(0.5)',
            zIndex: 1,
            animation: isExitingStarPage 
              ? 'starPageFadeOutStar 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
              : 'starPageFadeInStar 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        />
        
        {/* 结算底色图片 - 底层（模糊） */}
        <img
          src={settlementBackgroundImage}
          alt="结算底色"
          style={{
            position: 'absolute',
            top: '613px',
            left: '181px',
            transform: 'translate(-50%, -50%) scale(0.5)',
            width: '539px',
            height: '653px',
            objectFit: 'cover',
            opacity: isExitingStarPage ? 0 : 0.63,
            filter: 'blur(20px)',
            zIndex: 2,
            animation: isExitingStarPage ? 'starPageFadeOut 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'starPageFadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        />
        
        {/* 结算底色图片 - 顶层（透明度循环） */}
        <img
          src={settlementBackgroundImage}
          alt="结算底色"
          style={{
            position: 'absolute',
            top: '613px',
            left: '181px',
            transform: 'translate(-50%, -50%) scale(0.5)',
            width: '539px',
            height: '653px',
            objectFit: 'cover',
            opacity: isExitingStarPage ? 0 : 1,
            zIndex: 3,
            animation: isExitingStarPage 
              ? 'starPageFadeOut 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
              : 'starPageFadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        />
        
        {/* 结算底色图片 - 翻转层（垂直翻转，下方） */}
        <img
          src={settlementBackgroundImage}
          alt="结算底色"
          style={{
            position: 'absolute',
            top: '905px',
            left: '191px',
            transform: 'translate(-50%, -50%) scale(0.5) scaleY(-1)',
            width: '539px',
            height: '653px',
            objectFit: 'cover',
            opacity: isExitingStarPage ? 0 : 0.89,
            filter: 'blur(4.41px)',
            zIndex: 0,
            animation: isExitingStarPage ? 'starPageFadeOut 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'starPageFadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        />
        
        {/* 中间文本显示区域 */}
        {starPageTexts.map((text, index) => {
          // 如果内容加载完成且当前文字正在显示，立即应用消失动画
          const shouldFadeOut = !isEnteringLakeHeart && starPageTextIndex === index;
          const isActive = starPageTextIndex === index && isEnteringLakeHeart;
          
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 'calc(50% - 100px)',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                fontSize: '24px',
                fontFamily: "'Source Han Serif SC', 'Noto Serif SC', '思源宋体', serif",
                fontWeight: '400',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: 0,
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0.4) 100%)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                animation: shouldFadeOut
                  ? 'starPageTextFadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  : isActive
                  ? 'starPageTextFadeIn 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards, starPageTextAnimation 3.25s cubic-bezier(0.4, 0, 0.2, 1) 0.65s forwards, softShimmerSweep 12s ease-in-out infinite 0.65s'
                  : 'none',
                pointerEvents: 'none',
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    );
  }

  // 第四页 - 湖心页面
  if (showFourthPage) {
    return (
      <div className="relative bg-black overflow-hidden" style={{ width: '375px', height: '812px', margin: '0 auto' }}>
        {/* 背景图片层 - 最底层 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: showFourthPageBackground ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 0,
          }}
        />
        
        {/* 湖心手记底色图片层 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${lakeHeartBackgroundImage})`,
            backgroundSize: '100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0,
            zIndex: 1,
            top: '-45px',
            left: '7px',
            animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0s forwards',
          }}
        />
        
        {/* 照片 */}
        <img
          src={photoImage}
          alt="照片"
          style={{
            position: 'absolute',
            zIndex: 2,
            maxWidth: '100%',
            height: '223px',
            width: 'fit-content',
            left: '-41px',
            top: '546px',
            opacity: 0,
            animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 3.4s forwards',
          }}
        />
        
        {/* 湖心原始返回内容显示区域 - 调试用 */}
        {lakeHeartRawResponse && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width: 'calc(100% - 40px)',
              maxWidth: '500px',
              maxHeight: '80vh',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '6px',
              overflow: 'auto',
              fontSize: '13px',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.9)',
              display: showLakeHeartRawResponse ? 'block' : 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '0px' }}>
              <div style={{ fontWeight: 'bold', color: 'rgba(255, 255, 255, 1)', fontSize: '16px' }}>Coze 原始返回内容</div>
              <button
                onClick={() => setShowLakeHeartRawResponse(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  padding: '2px 0px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                关闭
              </button>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.6' }}>
              {(() => {
                // 尝试格式化 JSON
                try {
                  const jsonData = JSON.parse(lakeHeartRawResponse);
                  return JSON.stringify(jsonData, null, 2);
                } catch (e) {
                  // 不是 JSON，直接显示原始内容
                  return lakeHeartRawResponse;
                }
              })()}
            </div>
          </div>
        )}
        
        {/* Coze 配置按钮 - 始终显示在右上角 */}
        <button
          onClick={() => setShowCozeConfigDialog(true)}
          style={{
            position: 'fixed',
            top: '20px',
            right: lakeHeartRawResponse && !showLakeHeartRawResponse ? '140px' : '20px',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: 'rgba(255, 255, 255, 0.9)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            opacity: 0,
            animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          ⚙️ Coze 配置
        </button>

        {/* 显示湖心原始返回内容的按钮 */}
        {lakeHeartRawResponse && !showLakeHeartRawResponse && (
          <button
            onClick={() => setShowLakeHeartRawResponse(true)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '8px 16px',
              color: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              opacity: 0,
              animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            📋 查看原始返回
          </button>
        )}
        
        {/* 显示 Coze 返回的文本内容 - 按照M1M2M3M4分成四段 */}
        {lakeHeartContent && (
          <div
            style={{
              position: 'absolute',
              top: '284px',
              left: '191px',
              transform: 'translate(-50%, -50%) rotate(-2deg)',
              width: 'calc(100% - 40px)',
              maxWidth: '335px',
              padding: '6px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                textAlign: 'left',
              }}
            >
              {/* 标题：湖心手记 */}
              <div
                style={{
                  fontSize: '30px',
                  fontFamily: '汉仪瑞意宋',
                  fontWeight: '400',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  marginBottom: '14px',
                  opacity: 0,
                  animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards',
                }}
              >
                湖心手记
              </div>

              {/* 显示四段内容 */}
              {/* 如果解析出任何一段内容，按段显示；否则显示完整内容 */}
              {(lakeHeartSections.m1 || lakeHeartSections.m2 || lakeHeartSections.m3 || lakeHeartSections.m4) ? (
                <>
                  {/* M1部分 */}
                  {lakeHeartSections.m1 && (
                    <div
                      style={{
                        fontSize: '16px',
                        fontFamily: 'Noto Serif SC',
                        fontWeight: '400',
                        color: 'rgba(255, 240, 200, 0.9)',
                        lineHeight: '1.8',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '14px',
                        opacity: 0,
                        animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.3s forwards, yellowTextGlow 3s ease-in-out 2.1s infinite',
                        textShadow: '0 0 5px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 200, 0, 0.15)',
                      }}
                    >
                      {lakeHeartSections.m1}
                    </div>
                  )}

                  {/* M2部分 */}
                  {lakeHeartSections.m2 && (
                    <div
                      style={{
                        fontSize: '16px',
                        fontFamily: 'Noto Serif SC',
                        fontWeight: '400',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.8',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '14px',
                        opacity: 0,
                        animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.8s forwards',
                      }}
                    >
                      {lakeHeartSections.m2}
                    </div>
                  )}

                  {/* M3部分 */}
                  {lakeHeartSections.m3 && (
                    <div
                      style={{
                        fontSize: '16px',
                        fontFamily: 'Noto Serif SC',
                        fontWeight: '400',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.8',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '14px',
                        opacity: 0,
                        animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2.3s forwards',
                      }}
                    >
                      {lakeHeartSections.m3}
                    </div>
                  )}

                  {/* M4部分 */}
                  {lakeHeartSections.m4 && (
                    <div
                      style={{
                        fontSize: '16px',
                        fontFamily: 'Noto Serif SC',
                        fontWeight: '400',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.8',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        opacity: 0,
                        animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2.8s forwards',
                      }}
                    >
                      {lakeHeartSections.m4}
                    </div>
                  )}
                </>
              ) : (
                /* 如果没有解析出任何段落，显示完整内容 */
                <div
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Noto Serif SC',
                    fontWeight: '400',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.8',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    opacity: 0,
                    animation: 'messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.3s forwards',
                  }}
                >
                  {lakeHeartContent}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 底部按钮：继续和心湖聊聊 */}
        <div
          onClick={() => {
            // 淡出湖心页背景，淡入第三页背景
            setShowFourthPageBackground(false);
            setShowFourthPage(false);
            setShowThirdPage(true);
            // 延迟一小段时间后开始第三页背景淡入
            setTimeout(() => {
              setShowThirdPageBackground(true);
            }, 50);
          }}
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '20px',
            cursor: 'pointer',
            zIndex: 20,
            padding: '12px 24px',
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 0,
            animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 3.5s forwards',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span
            className="text-shimmer-effect"
            style={{
              fontSize: '13px',
              fontFamily: 'Noto Sans SC',
              fontWeight: '300',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            继续和心湖聊聊
          </span>
        </div>
        
      </div>
    );
  }

  if (showThirdPage) {
    return (
      <div ref={thirdPageContainerRef} className="relative bg-black overflow-hidden" style={{ width: '375px', height: '812px', margin: '0 auto' }}>
        {/* 背景图片层 - 最底层 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: showThirdPageBackground ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 0,
          }}
        />
        
        {/* 星光动画层 - 在退出动画和加载过程中显示 */}
        {(showStarAnimation || isEnteringLakeHeart) && (
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              zIndex: 100,
              pointerEvents: 'none',
              animation: isEnteringLakeHeart 
                ? 'starLightLoading 2s ease-in-out infinite' 
                : 'starLightRise 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          >
            <img
              src={starLightImage}
              alt="星光"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        )}
        {/* 标题 - 对话开始时向上滚动消失 */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '50%',
            transform: conversationHistory.length > 0 || isExitingThirdPage ? 'translate(-50%, -100px)' : 'translateX(-50%)',
            zIndex: 3,
            width: '321px',
            transition: conversationHistory.length > 0 || isExitingThirdPage ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            opacity: conversationHistory.length > 0 || isExitingThirdPage ? 0 : 1,
            filter: isExitingThirdPage ? 'blur(20px)' : 'blur(0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0px',
          }}
        >
          {/* 第一行：我是你的心湖， */}
          <div
            style={{
              fontSize: '30px',
              fontFamily: 'Noto Serif SC',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'left',
              opacity: conversationHistory.length > 0 ? 0 : 0,
              filter: conversationHistory.length > 0 ? 'blur(0)' : 'blur(20px)',
              animation: conversationHistory.length > 0 ? 'none' : (hasShownThirdPageTitle ? 'textFadeInBlur 1s ease-out 0.3s forwards' : 'none'),
            }}
          >
            我是你的心湖，
          </div>
          {/* 第二行：你的想法都可以告诉我 */}
          <div
            style={{
              fontSize: '30px',
              fontFamily: 'Noto Serif SC',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'left',
              opacity: conversationHistory.length > 0 ? 0 : 0,
              filter: conversationHistory.length > 0 ? 'blur(0)' : 'blur(20px)',
              animation: conversationHistory.length > 0 ? 'none' : (hasShownThirdPageTitle ? 'textFadeInBlur 1s ease-out 0.8s forwards' : 'none'),
            }}
          >
            你的想法都可以告诉我
          </div>
        </div>
        
        {/* Coze 原始返回内容对话框 */}
        {rawCozeResponse && (
          <>
            {/* 显示原始返回内容的按钮 */}
            {!showRawResponse && (
              <button
                onClick={() => setShowRawResponse(true)}
                style={{
                  position: 'fixed',
                  top: '20px',
                  right: showCozeConfigDialog ? '140px' : '20px',
                  zIndex: 1000,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                📋 查看 Coze 返回
              </button>
            )}
            
            {/* 对话框窗口 */}
            {showRawResponse && (
              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2000,
                  width: '90%',
                  maxWidth: '800px',
                  maxHeight: '80vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* 标题栏 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 1)',
                      fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
                    }}
                  >
                    📋 Coze API 原始返回内容
                  </div>
                  <button
                    onClick={() => setShowRawResponse(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '20px',
                      padding: '6px 16px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    关闭
                  </button>
                </div>
                
                {/* 内容区域 */}
                <div
                  style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '20px',
                    fontSize: '13px',
                    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {(() => {
                    // 尝试格式化 JSON
                    try {
                      const jsonData = JSON.parse(rawCozeResponse);
                      return JSON.stringify(jsonData, null, 2);
                    } catch (e) {
                      // 不是 JSON，直接显示原始内容
                      return rawCozeResponse;
                    }
                  })()}
                </div>
                
                {/* 底部信息栏 */}
                <div
                  style={{
                    padding: '12px 20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  内容长度: {rawCozeResponse.length} 字符
                </div>
              </div>
            )}
            
            {/* 遮罩层 */}
            {showRawResponse && (
              <div
                onClick={() => setShowRawResponse(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1999,
                  backdropFilter: 'blur(4px)',
                }}
              />
            )}
          </>
        )}
        
        {/* 对话历史记录 - 可滚动区域（全屏，在底部对话框下方） */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar"
          style={{
            position: 'absolute',
            top: '0px',
            left: '0',
            right: '0',
            bottom: '175px',
            zIndex: 10,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '20px 16px 20px 16px',
            paddingTop: '70px',
            paddingBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box',
            opacity: isExitingThirdPage ? 0 : 1,
            transform: isExitingThirdPage ? 'translateY(-100px)' : 'translateY(0)',
            filter: isExitingThirdPage ? 'blur(20px)' : 'blur(0)',
            transition: isExitingThirdPage ? 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            // 隐藏滚动条但保持滚动功能
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE 和 Edge
          }}
        >
          {conversationHistory.map((message, index) => {
            // 计算动画延迟：最上面的（索引小的）先出现，每个消息延迟100ms
            const animationDelay = index * 100;
            const totalMessages = conversationHistory.length;
            // 从下往上，最上面的先出现，所以索引小的延迟小
            const delay = animationDelay;
            
            // 判断是否有选项，如果有选项则外层不添加动画，让子元素分别动画
            const hasOptions = message.type === 'bot' && message.extractedOptions && (message.extractedOptions.length === 3 || message.extractedOptions.length === 4 || message.extractedOptions.length === 5);
            
            // 判断是否是最后一条用户消息（找到最后一条用户消息的索引）
            const lastUserMessageIndex = conversationHistory.map((msg, idx) => 
              msg.type === 'user' ? idx : -1
            ).filter(idx => idx !== -1).pop();
            const isLastUserMessage = message.type === 'user' && index === lastUserMessageIndex;
            
            return (
            <div 
              key={index}
              ref={isLastUserMessage ? lastUserMessageRef : null}
              data-message-type={message.type}
              data-message-index={index}
              style={{
                ...(hasOptions ? {} : {
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: `messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards`,
                }),
              }}
            >
              {/* 用户消息 - 右侧，淡黄色 */}
              {message.type === 'user' && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '16px',
                    width: '100%',
                    paddingRight: '0',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      marginRight: '0',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontFamily: 'Noto Serif SC',
                        fontWeight: '400',
                        color: 'rgba(255, 240, 200, 0.95)',
                        lineHeight: '1.6',
                        wordBreak: 'break-word',
                        textAlign: 'left',
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              )}

              {/* 机器人消息 - 左侧，白色 */}
              {message.type === 'bot' && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: (message.extractedOptions && (message.extractedOptions.length === 3 || message.extractedOptions.length === 4 || message.extractedOptions.length === 5)) ? 'center' : 'flex-start',
                    marginBottom: '16px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      maxWidth: (message.extractedOptions && (message.extractedOptions.length === 3 || message.extractedOptions.length === 4 || message.extractedOptions.length === 5)) ? '100%' : '70%',
                      padding: '12px 16px',
                      width: (message.extractedOptions && (message.extractedOptions.length === 3 || message.extractedOptions.length === 4 || message.extractedOptions.length === 5)) ? '100%' : 'auto',
                      boxSizing: 'border-box',
                      // 如果有选项，不在这里添加动画，让子元素分别动画
                      ...(message.extractedOptions && (message.extractedOptions.length === 3 || message.extractedOptions.length === 4 || message.extractedOptions.length === 5) ? {} : {
                        opacity: 0,
                        transform: 'translateY(20px)',
                        animation: `messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards`,
                      }),
                    }}
                  >
                    {/* 如果有三个或四个选项，显示问题和选项（不显示 content） */}
                    {message.extractedOptions && (message.extractedOptions.length === 3 || message.extractedOptions.length === 4 || message.extractedOptions.length === 5) ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          width: '100%',
                          maxWidth: '100%',
                          alignItems: 'center',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* 显示问题（一段话）- 严格按照样式：左对齐，白色，可多行 */}
                        {message.extractedQuestion && message.extractedQuestion.trim() && (
                          <div
                            style={{
                              fontSize: '16px',
                              fontFamily: 'Noto Serif SC',
                              fontWeight: '400',
                              color: 'rgba(255, 255, 255, 1)', // 纯白色，与图片一致
                              lineHeight: '1.6',
                              wordBreak: 'break-word',
                              marginBottom: '16px', // 增加与选项的间距
                              textAlign: 'left',
                              width: '100%',
                              maxWidth: '100%',
                              paddingLeft: '0px',
                              paddingRight: '0px',
                              boxSizing: 'border-box',
                              opacity: 0,
                              transform: 'translateY(20px)',
                              animation: `messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards`,
                              whiteSpace: 'pre-wrap', // 允许换行
                            }}
                          >
                            {message.extractedQuestion}
                          </div>
                        )}
                        
                        {/* 显示选项按钮 - 居中，宽度320，有背景框 */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            width: '100%',
                            maxWidth: '320px',
                            alignItems: 'center',
                            margin: '0 auto',
                            boxSizing: 'border-box',
                          }}
                        >
                          {message.extractedOptions.map((option, optIndex) => {
                            // 问题延迟 + 每个选项延迟150ms
                            const optionDelay = delay + 200 + (optIndex * 150);
                            // 创建选项的唯一标识
                            const optionKey = `${message.messageId || message.timestamp}-${optIndex}`;
                            const isSelected = selectedOptions.has(optionKey);
                            const isLakeHeart = option.includes('进入湖心') || option.includes('进入心湖');
                            // 显示文本：如果是进入湖心选项，显示完整文本；否则显示原文本
                            const displayText = isLakeHeart ? '进入湖心，看看结果' : option;
                            
                            return (
                            <button
                              key={optIndex}
                              onClick={async () => {
                                console.log('用户选择了选项，发送给Coze:', option);
                                
                                // 记录选中状态
                                setSelectedOptions(prev => {
                                  const newSet = new Set(prev);
                                  newSet.add(optionKey);
                                  return newSet;
                                });
                                
                                // 检测是否包含"进入湖心"或"进入心湖"
                                if (isLakeHeart) {
                                  // 调用进入湖心函数（函数内部会切换到星光页面）
                                  await handleEnterLakeHeart();
                                  return;
                                }
                                
                                await fetchBotReply(option);
                              }}
                              style={{
                                width: '100%',
                                maxWidth: '320px',
                                padding: '14px 20px',
                                fontSize: '16px',
                                fontFamily: 'Noto Serif SC',
                                fontWeight: '400',
                                color: isLakeHeart ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                                backgroundColor: isSelected 
                                  ? 'rgba(255, 240, 200, 0.15)' 
                                  : isLakeHeart
                                  ? 'rgba(255, 255, 255, 0.05)'
                                  : 'rgba(255, 255, 255, 0.1)',
                                border: isSelected
                                  ? '1px solid rgba(255, 220, 150, 0.4)'
                                  : isLakeHeart
                                  ? '1px solid rgba(255, 220, 150, 0.15)'
                                  : '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                backdropFilter: 'blur(10px)',
                                textAlign: 'left',
                                opacity: 0,
                                transform: 'translateY(20px)',
                                animation: isLakeHeart 
                                  ? `messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${optionDelay}ms forwards, lakeHeartGlow 3s ease-in-out infinite ${optionDelay + 800}ms`
                                  : `messageSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${optionDelay}ms forwards`,
                                boxShadow: isSelected
                                  ? '0 0 15px rgba(255, 220, 150, 0.3), 0 0 30px rgba(255, 220, 150, 0.15), inset 0 0 20px rgba(255, 240, 200, 0.1)'
                                  : isLakeHeart
                                  ? '0 0 10px rgba(255, 220, 150, 0.2), 0 0 20px rgba(255, 220, 150, 0.1), inset 0 0 10px rgba(255, 240, 200, 0.05)'
                                  : 'none',
                                position: 'relative',
                                boxSizing: 'border-box',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'normal',
                                overflow: 'visible',
                                textOverflow: 'clip',
                                lineHeight: '1.5',
                                minHeight: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                                  e.target.style.borderColor = isLakeHeart 
                                    ? 'rgba(255, 220, 150, 0.3)'
                                    : 'rgba(255, 255, 255, 0.2)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                  e.target.style.borderColor = isLakeHeart
                                    ? 'rgba(255, 220, 150, 0.2)'
                                    : 'rgba(255, 255, 255, 0.2)';
                                }
                              }}
                            >
                              {displayText}
                            </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      // 严格按照样式要求：只显示问题和四个选项的格式
                      // 如果没有选项，不显示任何内容（避免显示普通文本回复）
                      null
                    )}
                  </div>
                </div>
              )}
            </div>
            );
          })}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* 底部对话框固定层 - 最顶层，固定不动 */}
        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            right: '0px',
            height: '350px',
            zIndex: 100,
            pointerEvents: 'none',
            willChange: 'auto',
            opacity: isExitingThirdPage ? 0 : 1,
            transform: isExitingThirdPage ? 'translateY(-100px)' : 'translateY(0)',
            filter: isExitingThirdPage ? 'blur(20px)' : 'blur(0)',
            transition: isExitingThirdPage ? 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        >
          {/* 加载动画 - 黄色点光渐变呼吸闪烁（位于语音输入渐变区域，仅在语音识别和思考时显示，叠在文字后面） */}
          {(isListening || isProcessing || isFetchingReply) && (
            <div
              style={{
                position: 'absolute',
                bottom: '0px',
                left: '185px',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: '107px',
                opacity: 0.59,
                borderRadius: '0px',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: '180px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(255, 215, 0, 1) 0%, rgba(255, 200, 0, 0.8) 30%, rgba(255, 180, 0, 0.5) 50%, rgba(255, 160, 0, 0.2) 70%, transparent 100%)',
                  filter: 'blur(30px)',
                  animation: 'yellowDotGlow 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                  pointerEvents: 'none',
                  transform: 'translateY(50%)',
                }}
              />
            </div>
          )}
          
          {/* 底部文字容器 - 包含文字和热区 */}
          {!showInputBox && (
            <div
              style={{
                position: 'absolute',
                top: '252px',
                left: '188px',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '21px',
                touchAction: 'none',
                cursor: 'pointer',
                pointerEvents: 'auto',
                zIndex: 10,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              }}
              onTouchStart={handleGradientTouchStart}
              onTouchMove={handleGradientTouchMove}
              onTouchEnd={handleGradientTouchEnd}
              onMouseDown={(e) => {
                handleGradientTouchStart(e);
                // 确保鼠标事件能正确触发
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseMove={(e) => {
                // 鼠标移动时也更新位置（即使移出元素）
                if (isHoldingGradient) {
                  handleGradientTouchMove(e);
                }
              }}
              onMouseUp={(e) => {
                handleGradientTouchEnd(e);
              }}
              onMouseLeave={(e) => {
                // 鼠标移出元素时不处理，由全局事件处理
                // 这样可以确保即使鼠标移出也能继续跟踪
              }}
            >
              {/* 文字底部渐变 - 绝对定位 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '200px',
                  height: '100px',
                  background: 'linear-gradient(180deg, rgba(0, 120, 255, 0.6) 0%, rgba(0, 120, 255, 0.3) 50%, transparent 100%)',
                  filter: 'blur(80px)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />
              
              {/* 底部文字 */}
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: '400',
                  textAlign: 'center',
                  opacity: (isHoldingGradient || isListening || isProcessing || isFetchingReply) ? 1 : (showThirdPage && conversationHistory.length === 0 ? 0 : 0.6),
                  pointerEvents: 'none',
                  animation: (isHoldingGradient || isListening || isProcessing || isFetchingReply) 
                    ? 'textShimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                    : (showThirdPage && conversationHistory.length === 0 
                      ? 'fadeInUp 0.8s ease-out 1.5s forwards' 
                      : 'none'),
                  ...(isHoldingGradient || isListening || isProcessing || isFetchingReply) ? {
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.3) 100%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  } : {
                    color: 'rgba(255, 255, 255, 0.8)',
                  },
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {(isHoldingGradient || isListening) ? '心湖倾听中' : (isProcessing || isFetchingReply) ? '正在前往湖心...' : '按住说说你的想法'}
              </div>
            </div>
          )}
          
          {/* 键盘icon容器 - 包含icon和热区 */}
          {!isHoldingGradient && !showInputBox && (
            <div
              style={{
                position: 'absolute',
                left: '308px',
                top: '253px',
                height: '21px',
                width: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                pointerEvents: 'auto',
                zIndex: 10,
                opacity: showThirdPage && conversationHistory.length === 0 ? 0 : (showThirdPage ? 1 : 0),
                transform: showThirdPage && conversationHistory.length === 0 ? 'translateY(10px) scale(0.9)' : (showThirdPage ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)'),
                animation: showThirdPage && conversationHistory.length === 0 ? 'fadeInUp 0.8s ease-out 1.8s forwards' : 'none',
              }}
              onClick={handleKeyboardIconClick}
              onTouchStart={(e) => {
                e.preventDefault();
                handleKeyboardIconClick(e);
              }}
            >
              {/* 键盘icon底部渐变 - 绝对定位 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(180deg, rgba(0, 200, 100, 0.6) 0%, rgba(0, 200, 100, 0.3) 50%, transparent 100%)',
                  filter: 'blur(60px)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />
              
              <img
                src={keyboardIconImage}
                alt="键盘"
                style={{
                  height: '21px',
                  width: 'auto',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}
          
          {/* 输入框遮罩层 - 点击外部关闭输入框 */}
          {showInputBox && (
            <div
              style={{
                position: 'absolute',
                inset: '0',
                backgroundColor: 'transparent',
                pointerEvents: 'auto',
              }}
              onClick={handleInputCancel}
            />
          )}
          
          {/* 输入框 */}
          {showInputBox && (
            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%) translateY(50px)',
                width: 'calc(100% - 40px)',
                maxWidth: '335px',
                opacity: 0,
                animation: 'inputBoxSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                pointerEvents: 'auto',
                zIndex: 101,
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
            {/* 选中态的黄色渐变背景 */}
            {isInputFocused && (
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '0',
                  width: '100%',
                  height: '48px',
                  borderRadius: '40px',
                  background: 'linear-gradient(to left, rgba(255, 240, 200, 0.02) 0%, rgba(255, 240, 200, 0.1) 100%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            )}
            <form onSubmit={handleInputSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="向心湖说说你的烦恼"
                onFocus={(e) => {
                  setIsInputFocused(true);
                  // 阻止聚焦时的滚动
                  e.target.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
                }}
                onBlur={() => setIsInputFocused(false)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
                  color: 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid rgba(255, 220, 150, ${isInputFocused ? 0.3 : 0.1})`,
                  borderRadius: '40px',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  boxSizing: 'border-box',
                  zIndex: 1,
                  transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleInputCancel();
                  }
                }}
              />
            </form>
          </div>
        )}
        </div>
      </div>
    );
  }

  if (showSecondPage) {
    return (
      <div className="relative bg-black overflow-hidden" style={{ width: '375px', height: '812px', margin: '0 auto' }}>
        {/* 背景图片层 - 最底层 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: showSecondPageBackground ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 0,
          }}
        />
        
        {/* 紫色渐变圆形模糊背景 */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '298.5px',
            height: '193.5px',
            left: '38.5px',
            top: '-205.5px',
            backgroundColor: 'rgba(89, 80, 255, 1)',
            filter: 'blur(500px)',
            opacity: 0,
            zIndex: 1,
            animation: 'fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
          }}
        />
        
        {/* 标题 - 分段显示，左对齐 */}
        <div
          className="absolute"
          style={{
            top: '50px',
            left: '20px',
            opacity: isExitingSecondPage ? 0 : 1,
            filter: isExitingSecondPage ? 'blur(20px)' : 'blur(0)',
            zIndex: 3,
            width: 'calc(100% - 40px)',
            transition: isExitingSecondPage ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0px',
          }}
        >
          {/* 第一段：可以告诉我你的MBTI */}
          <div
            style={{
              fontSize: '30px',
              fontFamily: '汉仪瑞意宋',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'left',
              opacity: 0,
              filter: 'blur(20px)',
              animation: 'textFadeInBlur 1s ease-out 0.3s forwards',
            }}
          >
            <span style={{ opacity: 0.8 }}>可以告诉我你的MBTI</span>
          </div>
          {/* 第二段：这会让我更了解你 */}
          <div
            style={{
              fontSize: '30px',
              fontFamily: '汉仪瑞意宋',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'left',
              opacity: 0,
              filter: 'blur(20px)',
              animation: 'textFadeInBlur 1s ease-out 0.8s forwards',
            }}
          >
            <span style={{ opacity: 0.8 }}>这会让我更了解你</span>
          </div>
        </div>
        
        {/* MBTI字母选择器 - 4列，每列可以选择第一行或第二行 */}
        <div
          className="absolute"
          style={{
            top: 'calc(50% - 70px)',
            left: '50%',
            transform: isExitingSecondPage ? 'translate(-50%, -50%) translateY(-100px)' : 'translate(-50%, -50%)',
            width: '100%',
            height: '200px',
            zIndex: 2,
            opacity: isExitingSecondPage ? 0 : 0,
            filter: isExitingSecondPage ? 'blur(20px)' : 'blur(20px)',
            transition: isExitingSecondPage ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            animation: !isExitingSecondPage ? 'textFadeInBlur 1s ease-out 1.3s forwards' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '4px',
              position: 'relative',
            }}
          >
            {/* 4列字母选择器 */}
            {[0, 1, 2, 3].map((columnIndex) => {
              const currentIndex = mbtiColumnIndices[columnIndex]; // 0=第一行，1=第二行
              const dragOffset = mbtiColumnDragOffsets[columnIndex];
              const isDragging = mbtiColumnIsDragging[columnIndex];
              const letterRow1 = mbtiRow1[columnIndex]; // 第一行字母
              const letterRow2 = mbtiRow2[columnIndex]; // 第二行字母
              
              // 计算每行字母的位置
              const boxY = 0; // 框的中心位置（相对于top: 50%）
              const boxHeight = 70; // 选中框高度
              // currentIndex=0时，第一行在框内(y=0)，第二行在下方(y=70)
              // currentIndex=1时，第二行在框内(y=0)，第一行在上方(y=-70)
              const baseY1 = currentIndex === 0 ? boxY : -70; // 第一行基础位置
              const baseY2 = currentIndex === 1 ? boxY : 70; // 第二行基础位置（在下方）
              const row1Y = baseY1 + dragOffset * 0.5; // 第一行当前位置（加上拖拽偏移）
              const row2Y = baseY2 + dragOffset * 0.5; // 第二行当前位置（加上拖拽偏移）
              
              // 判断字母是否在选中框内（框的中心在y=0，高度70px，所以范围是-35到35）
              const row1InBox = Math.abs(row1Y) < 35; // 第一行字母是否在框内
              const row2InBox = Math.abs(row2Y) < 35; // 第二行字母是否在框内
              
              return (
                <div
                  key={columnIndex}
                  style={{
                    position: 'relative',
                    width: '70px',
                    height: '200px',
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}
                  onTouchStart={(e) => handleColumnTouchStart(columnIndex, e)}
                  onTouchMove={(e) => handleColumnTouchMove(columnIndex, e)}
                  onTouchEnd={() => handleColumnTouchEnd(columnIndex)}
                  onMouseDown={(e) => handleColumnMouseDown(columnIndex, e)}
                  onMouseMove={(e) => handleColumnMouseMove(columnIndex, e)}
                  onMouseUp={() => handleColumnMouseUp(columnIndex)}
                  onMouseLeave={() => {
                    // 鼠标离开时重置拖拽状态
                    if (mbtiColumnIsDragging[columnIndex]) {
                      handleColumnMouseUp(columnIndex);
                    }
                  }}
                  onClick={(e) => {
                    // 点击切换：如果没有拖拽，则切换选中状态
                    if (Math.abs(dragOffset) < 5) {
                      const newIndices = [...mbtiColumnIndices];
                      newIndices[columnIndex] = newIndices[columnIndex] === 0 ? 1 : 0;
                      setMbtiColumnIndices(newIndices);
                    }
                  }}
                >
                  {/* 选中状态的背景框（20%透明度的白色，始终显示） */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, 0)',
                      width: '60px',
                      height: '70px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      backdropFilter: 'blur(10px)',
                      pointerEvents: 'none',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(255, 220, 150, 0.3), 0 0 30px rgba(255, 220, 150, 0.15)',
                    }}
                  />
                  
                  {/* 第一行字母 */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, ${row1Y}px)`,
                      fontSize: '32px',
                      fontFamily: '汉仪瑞意宋',
                      fontWeight: '400',
                      color: row1InBox ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                      textAlign: 'center',
                      transition: !isDragging ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      zIndex: 2,
                      width: '60px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: row1InBox ? 'none' : 'blur(2px)',
                    }}
                  >
                    {letterRow1}
                  </div>
                  
                  {/* 第二行字母 */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, ${row2Y}px)`,
                      fontSize: '32px',
                      fontFamily: '汉仪瑞意宋',
                      fontWeight: '400',
                      color: row2InBox ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                      textAlign: 'center',
                      transition: !isDragging ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      zIndex: 2,
                      width: '60px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: row2InBox ? 'none' : 'blur(2px)',
                    }}
                  >
                    {letterRow2}
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 探索心湖按钮组件 - 文字和箭头整体居中对齐 */}
        <div
          className="absolute"
          style={{
            top: '667px',
            left: '50%',
            transform: isExitingSecondPage ? 'translateX(-50%) translateY(-100px)' : 'translateX(-50%)',
            cursor: 'pointer',
            zIndex: 3,
            pointerEvents: isExitingSecondPage ? 'none' : 'auto',
            opacity: 0,
            filter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            margin: 0,
            padding: 0,
            animation: isExitingSecondPage 
              ? 'exploreLakeFadeOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
              : 'exploreLakeFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
          }}
          onClick={handleNextStepClick}
          onTouchStart={(e) => {
            e.preventDefault();
            handleNextStepClick();
          }}
        >
          {/* 探索心湖文字 - 居中对齐 */}
          <div
            style={{
              fontSize: '16px',
              fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 400,
              opacity: 0.7,
              letterSpacing: '0',
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.3) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              animation: isExitingSecondPage 
                ? 'none' 
                : 'textShimmer 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.1s',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              padding: 0,
              height: '43px',
              lineHeight: '43px',
              margin: 0,
              boxSizing: 'border-box',
            }}
          >
            探索心湖
          </div>
        </div>
        
        {/* 向下箭头指示器 - 独立定位，不受按钮动画影响，带出现和消失动画 */}
        <div 
          className="absolute"
          style={{
            top: '718px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            cursor: 'pointer',
            pointerEvents: isExitingSecondPage ? 'none' : 'auto',
            padding: '0px',
            margin: 0,
            width: '31px',
            height: '31px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            opacity: 0,
            filter: 'blur(10px)',
            animation: isExitingSecondPage 
              ? 'arrowFadeOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
              : 'arrowFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.8s forwards, arrowBounce 1s cubic-bezier(0.4, 0, 0.2, 1) 2.6s infinite',
          }}
          onClick={handleNextStepClick}
          onTouchStart={(e) => {
            e.preventDefault();
            handleNextStepClick();
          }}
        >
          <div 
            style={{ 
              transform: 'rotate(-45deg)',
              width: '11px',
              height: '11px',
              margin: 0,
              padding: 0,
            }}
          >
            <div 
              style={{
                width: '11px',
                height: '11px',
                opacity: 0.4,
                borderLeft: '1.5px solid rgba(255, 255, 255, 1)',
                borderBottom: '1.5px solid rgba(255, 255, 255, 1)',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black overflow-hidden" style={{ width: '375px', height: '812px', margin: '0 auto' }}>
        <div
          className="relative"
          style={{
            width: '100%',
            height: '100%',
            transform: isTransitioning ? 'translateY(-50px) scale(1.2)' : 'translateY(0) scale(1)',
            filter: isTransitioning ? 'blur(5px)' : 'blur(0)',
            opacity: isTransitioning ? 0 : 1,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
        {/* 背景图片层 - 最底层 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            opacity: showFirstPageBackground ? 1 : 0,
            transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {/* 紫色渐变圆形模糊背景 */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '298.5px',
            height: '193.5px',
            left: '38.5px',
            top: '-205.5px',
            backgroundColor: 'rgba(89, 80, 255, 1)',
            filter: 'blur(500px)',
            opacity: 0,
            zIndex: 1,
            animation: 'fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
          }}
        />
        
        {/* 主要内容容器 - 375*812 */}
        <div 
          className="relative w-full h-full flex flex-col items-center justify-center" 
          style={{ 
            zIndex: 2,
          }}
        >
          {/* 主标题区域 - 三段文本依次出现 */}
          <div 
            className="absolute"
            style={{
              top: 'calc(50% - 50px)',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              width: 'calc(100% - 40px)',
              opacity: isExitingFirstPage ? 0 : 1,
              filter: isExitingFirstPage ? 'blur(20px)' : 'blur(0)',
              transition: isExitingFirstPage ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          >
            {/* 第一段：混合的情感 */}
            <div
              style={{
                fontSize: '32px',
                fontFamily: "'Noto Serif SC', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', serif",
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                opacity: 0,
                filter: 'blur(20px)',
                animation: 'textFadeInBlur 1s ease-out 0.3s forwards',
                willChange: 'opacity, filter',
                whiteSpace: 'nowrap',
                unicodeBidi: 'normal',
                direction: 'ltr',
              }}
            >
              {'混合的情感'}
            </div>
            {/* 第二段：就像混合的饮品 */}
            <div
              style={{
                fontSize: '32px',
                fontFamily: "'Noto Serif SC', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', serif",
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                opacity: 0,
                filter: 'blur(20px)',
                animation: 'textFadeInBlur 1s ease-out 0.8s forwards',
                willChange: 'opacity, filter',
                whiteSpace: 'nowrap',
                unicodeBidi: 'normal',
                direction: 'ltr',
              }}
            >
              {'就像混合的饮品'}
            </div>
            {/* 第三段：是灵魂的困惑 */}
            <div
              style={{
                fontSize: '32px',
                fontFamily: "'Noto Serif SC', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', serif",
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                opacity: 0,
                filter: 'blur(20px)',
                animation: 'textFadeInBlur 1s ease-out 1.3s forwards',
                willChange: 'opacity, filter',
              }}
            >
              是灵魂的困惑
            </div>
          </div>
          
        </div>
        </div>
        
        {/* Coze 配置对话框 */}
        <CozeConfigDialog 
          open={showCozeConfigDialog} 
          onOpenChange={setShowCozeConfigDialog} 
        />
    </div>
  );
};

export default Index;

