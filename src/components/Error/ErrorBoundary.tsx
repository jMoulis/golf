import { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface Props {
  children?: ReactNode;
}
interface State {
  hasError: boolean;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const stackFrames =
      (errorInfo.componentStack || '')
        .replaceAll('\n', '')
        .split('at ')
        .map((d) =>
          d
            .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
            .replaceAll('(', '')
            .replaceAll(' ', '')
        )
        .filter((d) => d) || [];
    const [childComponent] = stackFrames;

    toast.error(
      <div>
        <p style={{ color: '#fff' }}>{`Component: ${childComponent}`}</p>
        <p style={{ color: '#fff' }}>{`Error: ${error.message}`}</p>
      </div>,
      {}
    );
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>Ui Error occured</h1>
        </>
      );
    }

    return this.props.children;
  }
}
