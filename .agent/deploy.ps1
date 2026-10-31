# Déploiement atomique Angeli Visions (Windows -> VPS)
#
#   .\.agent\deploy.ps1              # déploie la version courante du dossier local
#   .\.agent\deploy.ps1 -Rollback    # revient à la release précédente
#
# Principe : les sources sont envoyées dans releases\<horodatage>, le build est fait
# sur le VPS pendant que l'ancienne version continue de servir, puis le lien `current`
# est basculé et PM2 fait un `reload` (zéro coupure). Si le build échoue, la
# production n'est pas touchée.

param(
    [switch]$Rollback,
    [string]$Host_ = "angelivisions"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

if ($Rollback) {
    Write-Host "== Rollback vers la release precedente ==" -ForegroundColor Yellow
    ssh $Host_ "bash /var/www/angelivisions/shared/deploy.sh rollback"
    exit $LASTEXITCODE
}

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
$tar = Join-Path $env:TEMP "av-$ts.tgz"

Write-Host "== 1/3 Preparation de l'archive ($ts) ==" -ForegroundColor Cyan
# On exclut tout ce qui est reconstruit ou inutile sur le serveur.
$excludes = @(
    "--exclude=node_modules", "--exclude=.next", "--exclude=.git",
    "--exclude=stitch-skills", "--exclude=*.tar", "--exclude=*.tar.gz",
    "--exclude=*.zip", "--exclude=*.tsbuildinfo", "--exclude=*.log",
    "--exclude=build_output*.txt", "--exclude=tsc_errors*.txt", "--exclude=.env.local",
    "--no-xattrs"
)
& tar @excludes -czf $tar -C $root .
if ($LASTEXITCODE -ne 0) { throw "tar a echoue" }
Write-Host ("   archive : {0:N1} Mo" -f ((Get-Item $tar).Length / 1MB))

Write-Host "== 2/3 Envoi sur le VPS ==" -ForegroundColor Cyan
scp -q $tar "${Host_}:/tmp/av-$ts.tgz"
ssh $Host_ "mkdir -p /var/www/angelivisions/releases/$ts && tar -xzf /tmp/av-$ts.tgz -C /var/www/angelivisions/releases/$ts && rm -f /tmp/av-$ts.tgz"
if ($LASTEXITCODE -ne 0) { throw "transfert a echoue" }

Write-Host "== 3/3 Build + bascule (sur le VPS) ==" -ForegroundColor Cyan
# Le script serveur est versionne dans .agent/server-deploy.sh
scp -q (Join-Path $root ".agent\server-deploy.sh") "${Host_}:/var/www/angelivisions/shared/deploy.sh"
ssh $Host_ "sed -i 's/\r$//' /var/www/angelivisions/shared/deploy.sh && chmod +x /var/www/angelivisions/shared/deploy.sh && bash /var/www/angelivisions/shared/deploy.sh $ts"
$code = $LASTEXITCODE

Remove-Item $tar -Force -ErrorAction SilentlyContinue
if ($code -ne 0) {
    Write-Host "DEPLOIEMENT EN ECHEC - la production n'a pas ete modifiee" -ForegroundColor Red
    exit $code
}
Write-Host "Deploiement termine." -ForegroundColor Green
exit 0
