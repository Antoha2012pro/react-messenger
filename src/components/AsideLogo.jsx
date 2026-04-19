import { useTheme } from "../ThemeContext";

const AsideLogo = () => {
    const { toggleTheme } = useTheme();
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 26, padding: "20px 24px 24px 24px" }}>
            <a href="https://orbitium.net" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14 }}>
                <img src="https://cdn.discordapp.com/attachments/1418674347526193242/1425171108843356231/orbitium3.jpg?ex=69e46646&is=69e314c6&hm=c81ddcaa919e5c9c01d7dbe214052d173802fa34582ba9e7cd2e4e5f078764b6&" alt="ORBitium Logo" style={{ width: 64 }} /><span style={{
                    color: "#00A3FF",
                    fontFamily: "Inter",
                    fontSize: "22px",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "normal",
                }}>ORB</span></a>
            <div style={{ display: "flex", alignItems: "stretch", gap: 12 }}>
                <div style={{ flex: 1, position: "relative" }}>

                    <img
                        src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-9.png"
                        alt="Icon"
                        style={{
                            width: 18,
                            height: 18,
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            opacity: 0.7,
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search messages, people"
                        style={{
                            width: "100%",
                            height: 46,
                            boxSizing: "border-box",
                            padding: "0 14px 0 42px",
                            borderRadius: 12,
                            border: "1px solid rgba(204, 207, 208, 0.30)",
                            backgroundColor: "transparent",
                            color: "rgba(171, 175, 177, 0.9)",
                            fontFamily: "Inter",
                            fontSize: 16,
                            fontWeight: 400,
                            outline: "none",
                        }}
                    />
                </div>
                <button
                    style={{
                        width: 46,
                        height: 46,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        borderRadius: 12,
                        backgroundColor: "#00A3FF",
                        position: "relative",
                    }}
                ><span
                    style={{
                        position: "relative",
                        width: 20,
                        height: 20,
                        display: "block",
                    }}
                >
                        <span
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                width: 20,
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
                                height: 20,
                                backgroundColor: "#fff",
                                borderRadius: 999,
                                transform: "translateX(-50%)",
                            }}
                        />
                    </span></button>
            </div>
            <button onClick={toggleTheme} style={{ color: "var(--title)" }}>Переключити тему</button>
        </div>
    )
}

export default AsideLogo
