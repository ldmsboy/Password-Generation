<footer class="text-center py-8">
    <p class="text-xs text-gray-400" id="copyright"></p>
</footer>

<script src="menu.js" defer></script>
<script src="stats.js" defer></script>
<script src="strength.js" defer></script>

<?php if (isset($pageScript)): ?>
<script src="<?php echo $pageScript; ?>" defer></script>
<?php endif; ?>

<?php if (isset($pageScripts) && is_array($pageScripts)): ?>
    <?php foreach ($pageScripts as $script): ?>
<script src="<?php echo $script; ?>" defer></script>
    <?php endforeach; ?>
<?php endif; ?>

</body>
</html>