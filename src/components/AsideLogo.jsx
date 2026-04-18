import { useTheme } from "../ThemeContext";

const AsideLogo = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 26, padding: "20px 24px 24px 24px" }}>
            <a href="#" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14 }}>
                <img src="https://cdn.discordapp.com/attachments/1418674347526193242/1425171108843356231/orbitium3.jpg?ex=69e46646&is=69e314c6&hm=c81ddcaa919e5c9c01d7dbe214052d173802fa34582ba9e7cd2e4e5f078764b6&" alt="ORBitium Logo" style={{ width: 64 }} /><span style={{
                    color: "#00A3FF",
                    fontFamily: "Inter",
                    fontSize: "22px",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "normal",
                }}>ORB</span></a>
            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                <div style={{ width: "100%", position: "relative" }}>
                    <img src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-9.png" alt="Icon" style={{ width: 22, height: 22, position: "absolute", inset: "50% 0 0 14px", transform: "translateY(-50%)" }} />
                    <input type="text" placeholder="Search messages, people" style={{
                        padding: "13px 45px 14px 45px",
                        borderRadius: "12px",
                        border: "1px solid rgba(204, 207, 208, 0.30)",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        color: "rgba(171, 175, 177, 0.6)",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "normal",
                    }} />
                </div>
                <button style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    borderRadius: 12,
                    backgroundColor: "#00A3FF",
                    position: "relative",
                }}><span
                    style={{
                        position: "relative",
                        width: 24,
                        height: 24,
                        display: "block",
                    }}
                >
                        <span
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                width: 24,
                                height: 3,
                                backgroundColor: "#fff",
                                borderRadius: 999,
                                transform: "translateY(-50%)",
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                width: 3,
                                height: 24,
                                backgroundColor: "#fff",
                                borderRadius: 999,
                                transform: "translateX(-50%)",
                            }}
                        />
                    </span></button>
            </div>
            <button onClick={toggleTheme} style={{color: "var(--title)"}}>Переключити тему</button>
        </div>
    )
}

export default AsideLogo
