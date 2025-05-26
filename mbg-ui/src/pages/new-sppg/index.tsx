export default function NotFoundError() {
    const newUrl = "http://sppggeomapping.vercel.app/"

    return (
        <div className="h-svh">
            <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-4 px-4">
                <img
                    src="/ifsr-logo.png"
                    alt="SPPG Geomapping Logo"
                    className="h-8"
                />
                <h1 className="text-[7rem] font-bold leading-tight">404</h1>
                <span className="font-medium text-xl">Kami sudah pindah!</span>
                <p className="text-center text-muted-foreground max-w-md">
                    Silakan gunakan aplikasi baru SPPG Geomapping di{' '}
                    <a
                        href={newUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        {newUrl}
                    </a>
                </p>
            </div>
        </div>
    )
}
