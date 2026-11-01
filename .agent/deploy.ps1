# Déploiement atomique Angeli Visions (Windows -> VPS)
#
#   .\.agent\deploy.ps1              # déploie la version courante du dossier local
#   .\.agent\deploy.ps1 -Rollback    # revient à la release précédente
#   .\.agent\deploy.ps1 -SkipSeo     # déploie sans signaler le sitemap aux moteurs
#
# Principe : les sources sont envoyées dans releases\<horodatage>, le build est fait
# sur le VPS pendant que l'ancienne version continue de servir, puis le lien `current`
# est basculé et PM2 fait un `reload` (zéro coupure). Si le build échoue, la
# production n'est pas touchée.
#
# Après la bascule, scripts/seo-ping.mjs signale les URL à IndexNow (Bing, Yandex,
# Seznam, Naver) et soumet le sitemap à Google Search Console si un compte de
# service est configuré.

param(
    [switch]$Rollback,
    [switch]$SkipSeo,
    [string]$Host_ = "angelivisions"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Les commandes natives écrivent sur stderr (tar, ssh, scp) : sans ce réglage,
# PowerShell les traite comme des exceptions et coupe le script en plein vol.
# Le code de sortie réel est vérifié par Invoke-Native.
function Invoke-Native {
    param([scriptblock]$Command, [string]$What)

    $previous = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & $Command
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previous
    }

    if ($code -ne 0) { throw "$What a echoue (code $code)" }
}

if ($Rollback) {
    Write-Host "== Rollback vers la release precedente ==" -ForegroundColor Yellow
    Invoke-Native { ssh $Host_ "bash /var/www/angelivisions/shared/deploy.sh rollback" } "rollback"
    exit 0
}

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
$tar = Join-Path $env:TEMP "av-$ts.tgz"

Write-Host "== 1/4 Preparation de l'archive ($ts) ==" -ForegroundColor Cyan
# On exclut tout ce qui est reconstruit ou inutile sur le serveur.
$excludes = @(
    "--exclude=node_modules", "--exclude=.next", "--exclude=.git",
    "--exclude=stitch-skills", "--exclude=*.tar", "--exclude=*.tar.gz",
    "--exclude=*.zip", "--exclude=*.tsbuildinfo", "--exclude=*.log",
    "--exclude=build_output*.txt", "--exclude=tsc_errors*.txt", "--exclude=.env.local",
    "--exclude=gsc-service-account.json",
    "--no-xattrs"
)
Invoke-Native { & tar @excludes -czf $tar -C $root . } "tar"
Write-Host ("   archive : {0:N1} Mo" -f ((Get-Item $tar).Length / 1MB))

Write-Host "== 2/4 Envoi sur le VPS ==" -ForegroundColor Cyan
Invoke-Native { scp -q $tar "${Host_}:/tmp/av-$ts.tgz" } "scp archive"
Invoke-Native {
    ssh $Host_ "mkdir -p /var/www/angelivisions/releases/$ts && tar -xzf /tmp/av-$ts.tgz -C /var/www/angelivisions/releases/$ts && rm -f /tmp/av-$ts.tgz"
} "extraction sur le VPS"

Write-Host "== 3/4 Build + bascule (sur le VPS) ==" -ForegroundColor Cyan
# Le script serveur est versionne dans .agent/server-deploy.sh
Invoke-Native { scp -q (Join-Path $root ".agent\server-deploy.sh") "${Host_}:/var/www/angelivisions/shared/deploy.sh" } "scp deploy.sh"
Invoke-Native {
    ssh $Host_ "sed -i 's/\r$//' /var/www/angelivisions/shared/deploy.sh && chmod +x /var/www/angelivisions/shared/deploy.sh && bash /var/www/angelivisions/shared/deploy.sh $ts"
} "build et bascule"

Remove-Item $tar -Force -ErrorAction SilentlyContinue

if ($SkipSeo) {
    Write-Host "== 4/4 Signalement SEO ignore (-SkipSeo) ==" -ForegroundColor DarkGray
    Write-Host "Deploiement termine." -ForegroundColor Green
    exit 0
}

Write-Host "== 4/4 Signalement SEO ==" -ForegroundColor Cyan
# Non bloquant : un souci d'API ne doit pas invalider un deploiement reussi.
# La cle IndexNow est lue dans public\<cle>.txt par le script.
$previous = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& node (Join-Path $root "scripts\seo-ping.mjs")
$ErrorActionPreference = $previous

Write-Host "Deploiement termine." -ForegroundColor Green
exit 0
