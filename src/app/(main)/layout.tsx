'use client';
import { httpClient } from "@/libs/api.client";
import { useGetMe } from "@/services/auth.service";
import { UserOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Avatar, Layout, Menu, notification, Popover } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect } from "react";

const items = new Array(3).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: `nav ${index + 1}`,
}));

const queryClient = new QueryClient();

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data, isLoading } = useGetMe(queryClient);

    useEffect(() => {
        if (!isLoading && !data) {
            notification.error({
                placement: 'top',
                message: 'Unauthenticated',
            });
            //neu cho nay dung router.push thi se chi soft reload
            //gay bug khi push sang login xong dang nhap lai
            //boi vi khi do hook useGetMe co isLoading luon la false trong lan dau tien
            window.location.href = '/login';
        }
    }, [data, isLoading]);

    if (isLoading || !data) {
        return (
            <div className="h-[100vh] flex items-center justify-center">
                <img src="/images/loading.gif" alt="Loading..." />
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div className="text-xl text-white font-bold mr-6">BASE</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={items}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    <Popover
                        placement="bottomLeft"
                        trigger="click"
                        title={data.username}
                        content={<div className="flex flex-col gap-4 pt-4 border-t-gray-400 border-t">
                            <a onClick={() => {}}>View profile</a>
                            <a onClick={() => {}}>Change password</a>
                            <a onClick={() => {
                                httpClient.setToken('')
                                localStorage.removeItem('act')
                                window.location.href = '/login'
                                notification.success({
                                    placement: 'top',
                                    message: 'Logout!'
                                })
                            }}>Logout</a>
                        </div>}
                    >
                        <Avatar size="large" icon={<UserOutlined />} />
                    </Popover>
                </Header>
                <Content style={{ padding: '0 48px' }}>
                    <div>{children}</div>
                </Content>
            </Layout>
        </QueryClientProvider>
    );
}
