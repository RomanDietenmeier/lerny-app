import { MarkdownViewer } from 'components/MarkdownViewer';
import ProjectPane from 'components/ProjectPagePane';
import {
  ProjectPageContentWrapper,
  ProjectPageWrapper,
} from 'pages/ProjectPage.style';
import React, { useState } from 'react';

export function ProjectPage() {
  const [learnPageContent, setLearnPageContent] = useState('');

  function handleChangeLearnPageContent(content: string) {
    setLearnPageContent(content);
  }
  return (
    <ProjectPageWrapper>
      <ProjectPane onChangeLearnPageContent={handleChangeLearnPageContent} />
      <ProjectPageContentWrapper>
        <MarkdownViewer content={learnPageContent} />
      </ProjectPageContentWrapper>
    </ProjectPageWrapper>
  );
}
