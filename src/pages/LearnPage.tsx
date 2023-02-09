import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { useSearchParamsOnSelectedLearnPage } from '../hooks/LearnPageHooks';

export function LearnPage() {
  const { learnPage, learnProject } = useSearchParamsOnSelectedLearnPage();
  const [learnPageContent, setLearnPageContent] = useState('');

  useAsyncEffect(async (isMounted) => {
    const loadedLearnPageContent =
      await window.electron.learnPage.loadLearnPage(learnProject, learnPage);
    if (!isMounted()) return;
    setLearnPageContent(loadedLearnPageContent);
  }, []);

  return <MarkdownViewer content={learnPageContent} />;
}
