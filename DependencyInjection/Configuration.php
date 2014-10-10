<?php

namespace Bigfoot\Theme\AceThemeBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('bigfoot_ace_theme');

        $rootNode
            ->children()
                ->scalarNode('login_logo')->defaultNull()->end()
                ->scalarNode('assistance_link')->defaultNull()->end()
                ->scalarNode('title')->defaultValue('Administration Interface')->end()
                ->scalarNode('company_name')->defaultValue('Bigfoot')->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
