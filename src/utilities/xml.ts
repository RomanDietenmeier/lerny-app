import { xml2js } from 'xml-js';

export function retrieveXmlData(xmlString: string) {
  try {
    const xml = xml2js(xmlString, { compact: true }) as {
      xml?: {
        'build-command'?: { _text: string };
        'run-command'?: { _text: string };
        'starter-code'?: { _text: string };
        'test-command'?: { _text: string };
      };
    };
    if (!xml.xml) return {};
    return {
      buildCommand: xml.xml['build-command']?._text,
      runCommand: xml.xml['run-command']?._text,
      starterCode: xml.xml['starter-code']?._text,
      testCommand: xml.xml['test-command']?._text,
    };
  } catch (err) {
    console.error('XML Parse Error: ', err);
    return {};
  }
}

export function retrieveExecutableCodeEditorData(xmlString: string) {
  try {
    const xml = xml2js(xmlString, { compact: true }) as {
      'executable-code-editor'?: {
        xml?: {
          'build-command'?: { _text: string };
          'run-command'?: { _text: string };
          'starter-code'?: { _text: string };
          'test-command'?: { _text: string };
        };
        _attributes?: {
          filename?: string;
          language?: string;
        };
      };
    };
    if (!xml['executable-code-editor']) return {};
    return {
      executableCodeEditorAttributes:
        xml['executable-code-editor']?._attributes,
      executableCodeEditorBuild:
        xml['executable-code-editor']?.xml?.['build-command']?._text?.trim(),
      executableCodeEditorRun:
        xml['executable-code-editor']?.xml?.['run-command']?._text?.trim(),
      executableCodeEditorTest:
        xml['executable-code-editor']?.xml?.['test-command']?._text?.trim(),
      executableCodeEditorCode:
        xml['executable-code-editor']?.xml?.['starter-code']?._text?.trim(),
    };
  } catch (err) {
    console.error('XML Parse Error: ', err);
    return {};
  }
}
