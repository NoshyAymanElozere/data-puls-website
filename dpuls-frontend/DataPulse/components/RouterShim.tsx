import React, {useEffect, useState} from "react";
import NextLink from "next/link";
import {useRouter} from "next/router";

// Link Shim
export const Link = ({to, children, ...props}: any) => {
  return (
    <NextLink href={to} {...props}>
      {children}
    </NextLink>
  );
};

// NavLink Shim
export const NavLink = ({to, children, className, end, ...props}: any) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    const resolvedClassName =
      typeof className === "function"
        ? className({isActive: false})
        : className;
    return (
      <NextLink href={to} className={resolvedClassName} {...props}>
        {children}
      </NextLink>
    );
  }

  const currentPath = router.asPath.split("?")[0];

  // Logic to mimic React Router NavLink active state
  // Default is specific prefix match (unless 'end' is true, which forces exact)
  // Also special handling for root '/' to avoid matching everything
  let isActive = currentPath === to;
  if (!end && to !== "/" && currentPath.startsWith(to)) {
    // Ensure we don't partial match e.g. /service to /services
    // Check boundary
    const nextChar = currentPath.charAt(to.length);
    if (!nextChar || nextChar === "/") {
      isActive = true;
    }
  }

  const resolvedClassName =
    typeof className === "function"
      ? className({isActive})
      : isActive
        ? `${className} active`
        : className;

  return (
    <NextLink href={to} className={resolvedClassName} {...props}>
      {children}
    </NextLink>
  );
};

// useParams Shim
export const useParams = <
  T extends Record<string, string | string[] | undefined> = Record<
    string,
    string | string[] | undefined
  >,
>() => {
  const router = useRouter();
  return (router.query as unknown as T) || ({} as T);
};

// useLocation Shim
export const useLocation = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return {
      pathname: "",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };
  }

  const [pathname, search] = router.asPath.split("?");

  return {
    pathname: pathname,
    search: search ? `?${search}` : "",
    hash: window.location.hash,
    state: null,
    key: "default",
  };
};

export const useNavigate = () => {
  const router = useRouter();
  return (to: string) => router.push(to);
};

export const Navigate = ({to, replace}: {to: string; replace?: boolean}) => {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
};

export const BrowserRouter = ({children}: any) => <>{children}</>;
export const HashRouter = ({children}: any) => <>{children}</>;
export const Routes = ({children}: any) => <>{children}</>;
export const Route = (props: any) => null;
export const Outlet = () => null;
