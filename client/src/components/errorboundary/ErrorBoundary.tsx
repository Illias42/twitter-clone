import React from "react";
import { Navigate } from "react-router-dom";

interface ErrorBoundaryState {
    error?: unknown;
    hasError: boolean;
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryState) {
        super(props);
        this.state = {
            error: null,
            hasError: false
        };
    }

    static getDerivedStateFromError(error: unknown) {
        return {
            error: error,
            hasError: true
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log("adadada", errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Navigate replace to="/error" />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;