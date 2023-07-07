import React, { useState } from 'react';
import { ProjectPageWrapper } from './ProjectPage.style';
import { MarkdownViewer } from 'components/MarkdownViewer';
import ProjectPane from 'components/ProjectPane';

export function ProjectPage() {
  const [learnPageContent, setLearnPageContent] = useState('');

  function handleChangeLearnPageContent(content: string) {
    setLearnPageContent(content);
  }
  return (
    <ProjectPageWrapper>
      <ProjectPane onChangeLearnPageContent={handleChangeLearnPageContent} />
      <MarkdownViewer content={learnPageContent} />
    </ProjectPageWrapper>
  );
}
